/* ==========================================================================
   Persistência.

   Camada 1 — localStorage: grava a cada alteração, funciona offline e sem
              configuração nenhuma. É o que garante "salvar o que o Breno
              adicionar" já no primeiro acesso.
   Camada 2 — Supabase (opcional): sincroniza o mesmo documento entre
              aparelhos. Ligada preenchendo js/config.js.
   Camada 3 — Backup manual: exportar/importar JSON, em Ajustes.

   O estado é UM documento JSON. Para o progresso de um estudante isso é
   suficiente e evita modelar dez tabelas. Conflito entre aparelhos resolve
   por "quem gravou por último vence", comparando atualizado_em.
   ========================================================================== */

import { APP, SUPABASE, supabaseLigado } from "./config.js";

const VERSAO_ESTADO = 1;

function estadoVazio() {
  return {
    v: VERSAO_ESTADO,
    datas: { inicio: "2026-09-01", prova: "2027-05-10" },
    topicos: {},    // id -> {status, dataEstudo, confianca, acerto, obs}
    meses: {},      // "Set/26|Língua Portuguesa" -> {status, pct}
    semanas: {},    // n -> {meta, horas, questoes, certas, treinos, aulas, simulado, nota, obs}
    dia: {},        // "YYYY-MM-DD" -> {indiceDoBloco: true}
    simulados: [],
    taf: [],
    tema: "auto",
    atualizado_em: null,
  };
}

/* ------------------------------------------------------------------ eventos */
const ouvintes = new Set();
export const aoMudar = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn); };
const emitir = () => ouvintes.forEach((f) => { try { f(estado); } catch (e) { console.error(e); } });

/* ------------------------------------------------------------------- estado */
export let estado = estadoVazio();

export const sync = {
  modo: "local",     // "local" | "nuvem"
  situacao: "ok",    // "ok" | "gravando" | "erro" | "deslogado"
  detalhe: "",
  email: null,
};

function carregarLocal() {
  try {
    const cru = localStorage.getItem(APP.chaveLocal);
    if (!cru) return null;
    const obj = JSON.parse(cru);
    return obj && typeof obj === "object" ? obj : null;
  } catch (e) {
    console.warn("estado local ilegível", e);
    return null;
  }
}

function migrar(obj) {
  const base = estadoVazio();
  const novo = { ...base, ...obj };
  novo.datas = { ...base.datas, ...(obj.datas || {}) };
  for (const k of ["topicos", "meses", "semanas", "dia"]) {
    novo[k] = { ...(obj[k] || {}) };
  }
  for (const k of ["simulados", "taf"]) {
    novo[k] = Array.isArray(obj[k]) ? obj[k] : [];
  }
  novo.v = VERSAO_ESTADO;
  return novo;
}

let gravarTimer = null;

function gravarLocal() {
  try {
    localStorage.setItem(APP.chaveLocal, JSON.stringify(estado));
    return true;
  } catch (e) {
    console.error("falha ao gravar local", e);
    sync.situacao = "erro";
    sync.detalhe = "Sem espaço no navegador. Exporte um backup em Ajustes.";
    return false;
  }
}

/** Altera o estado, grava na hora e agenda a sincronização na nuvem. */
export function mudar(fn) {
  fn(estado);
  estado.atualizado_em = new Date().toISOString();
  gravarLocal();
  emitir();
  if (sync.modo === "nuvem") {
    clearTimeout(gravarTimer);
    sync.situacao = "gravando";
    gravarTimer = setTimeout(() => { enviarNuvem().catch(() => {}); }, 1200);
  }
}

/* ---------------------------------------------------------------- atalhos */
export const topico = (id) =>
  estado.topicos[id] || { status: "", dataEstudo: "", confianca: "", acerto: "", obs: "" };

export const semana = (n) =>
  estado.semanas[n] || { meta: "", horas: "", questoes: "", certas: "", treinos: "",
                         simulado: "", nota: "", obs: "" };

export const mesItem = (chave) => estado.meses[chave] || { status: "", pct: "" };

export const CONCLUIDOS = ["Concluído", "Revisado"];

/* --------------------------------------------------------------- Supabase */
let sb = null;

async function clienteSupabase() {
  if (sb) return sb;
  if (!supabaseLigado()) return null;
  const { createClient } = await import("./vendor/supabase.js");
  sb = createClient(SUPABASE.url, SUPABASE.chavePublishable, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return sb;
}

export async function entrar(email, senha) {
  const c = await clienteSupabase();
  if (!c) throw new Error("Supabase não configurado em js/config.js");
  const { error } = await c.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  await iniciarNuvem();
}

export async function sair() {
  const c = await clienteSupabase();
  if (c) await c.auth.signOut();
  sync.modo = "local"; sync.email = null; sync.situacao = "ok"; sync.detalhe = "";
  emitir();
}

async function usuario() {
  const c = await clienteSupabase();
  if (!c) return null;
  const { data } = await c.auth.getUser();
  return data?.user || null;
}

async function iniciarNuvem() {
  const c = await clienteSupabase();
  if (!c) return;
  const u = await usuario();
  if (!u) { sync.modo = "local"; sync.situacao = "deslogado"; emitir(); return; }

  sync.modo = "nuvem"; sync.email = u.email; sync.situacao = "gravando"; emitir();

  const { data, error } = await c
    .from("progresso").select("dados, atualizado_em").eq("usuario_id", u.id).maybeSingle();

  if (error) {
    sync.situacao = "erro";
    sync.detalhe = "Não consegui ler da nuvem. Seus dados locais estão intactos.";
    emitir();
    return;
  }

  const remoto = data?.dados || null;
  const tRemoto = data?.atualizado_em ? Date.parse(data.atualizado_em) : 0;
  const tLocal = estado.atualizado_em ? Date.parse(estado.atualizado_em) : 0;

  if (remoto && tRemoto > tLocal) {
    estado = migrar(remoto);
    gravarLocal();
  }
  await enviarNuvem();
  emitir();
}

async function enviarNuvem() {
  const c = await clienteSupabase();
  if (!c) return;
  const u = await usuario();
  if (!u) { sync.situacao = "deslogado"; emitir(); return; }
  const { error } = await c.from("progresso").upsert({
    usuario_id: u.id,
    dados: estado,
    atualizado_em: estado.atualizado_em || new Date().toISOString(),
  }, { onConflict: "usuario_id" });

  if (error) {
    // offline conta como normal: o localStorage já guardou; tenta de novo depois
    sync.situacao = navigator.onLine ? "erro" : "ok";
    sync.detalhe = navigator.onLine
      ? "Falha ao gravar na nuvem — o dado está salvo neste aparelho."
      : "Sem rede. Salvo neste aparelho; sincroniza quando voltar.";
  } else {
    sync.situacao = "ok"; sync.detalhe = "";
  }
  emitir();
}

window.addEventListener("online", () => {
  if (sync.modo === "nuvem") enviarNuvem().catch(() => {});
});

/* ------------------------------------------------------------ backup manual */
export function exportarJSON() {
  const blob = new Blob([JSON.stringify(estado, null, 1)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const hoje = new Date().toISOString().slice(0, 10);
  a.href = url; a.download = `cronograma-gm-marica-${hoje}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function importarJSON(arquivo) {
  const txto = await arquivo.text();
  const obj = JSON.parse(txto);
  if (!obj || typeof obj !== "object" || !("topicos" in obj)) {
    throw new Error("Este arquivo não parece um backup do cronograma.");
  }
  estado = migrar(obj);
  estado.atualizado_em = new Date().toISOString();
  gravarLocal();
  emitir();
  if (sync.modo === "nuvem") await enviarNuvem();
}

export function apagarTudo() {
  estado = estadoVazio();
  localStorage.removeItem(APP.chaveLocal);
  emitir();
  if (sync.modo === "nuvem") enviarNuvem().catch(() => {});
}

/* ------------------------------------------------------------------ arranque */
export async function iniciar() {
  const local = carregarLocal();
  if (local) estado = migrar(local);
  if (supabaseLigado()) {
    try { await iniciarNuvem(); }
    catch (e) { console.warn("nuvem indisponível", e); sync.situacao = "erro"; }
  }
  emitir();
}