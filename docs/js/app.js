/* Roteador e casca da aplicação. */

import { APP, supabaseLigado } from "./config.js";
import { iniciar, aoMudar, sync, estado } from "./store.js";
import { el, $, toast } from "./ui.js";

import { viewHoje } from "./views/hoje.js";
import { viewPainel } from "./views/painel.js";
import { viewGrade } from "./views/grade.js";
import { viewMensal } from "./views/mensal.js";
import { viewConteudo } from "./views/conteudo.js";
import { viewSemanas } from "./views/semanas.js";
import { viewSimulados, viewTaf } from "./views/registros.js";
import { viewAjustes } from "./views/ajustes.js";

export let dados = null;

const ROTAS = [
  { id: "hoje",     ic: "☀",  rot: "Hoje",      sub: "O que fazer agora",                 view: viewHoje,     tab: true },
  { id: "painel",   ic: "📊", rot: "Painel",    sub: "Quanto falta e como você está",     view: viewPainel,   tab: true },
  { id: "grade",    ic: "🗓", rot: "Grade",     sub: "A semana inteira, hora a hora",     view: viewGrade,    tab: true },
  { id: "conteudo", ic: "✅", rot: "Conteúdo",  sub: "Os 80 tópicos e a revisão",         view: viewConteudo, tab: true },
  { id: "mensal",   ic: "📅", rot: "Plano mensal", sub: "Set/2026 a Mai/2027",           view: viewMensal },
  { id: "semanas",  ic: "📈", rot: "Semanas",   sub: "Registro das 38 semanas",           view: viewSemanas },
  { id: "simulados",ic: "📝", rot: "Simulados", sub: "Nota por matéria",                  view: viewSimulados },
  { id: "taf",      ic: "🏃", rot: "TAF",       sub: "Corrida, força e resistência",      view: viewTaf },
  { id: "ajustes",  ic: "⚙",  rot: "Ajustes",   sub: "Backup, sincronização e datas",     view: viewAjustes, tab: true },
];

const rotaAtual = () => {
  const id = (location.hash.replace(/^#\/?/, "") || "hoje").split("?")[0];
  return ROTAS.find((r) => r.id === id) || ROTAS[0];
};

/* --------------------------------------------------------------- navegação */
function montarNav() {
  const nav = $("#nav");
  nav.innerHTML = "";
  for (const r of ROTAS) {
    nav.appendChild(el("a", {
      class: "navlink", href: `#/${r.id}`, dataset: { rota: r.id },
    }, [el("span", { class: "navlink__ic", texto: r.ic }), r.rot]));
  }

  const tb = $("#tabbar");
  tb.innerHTML = "";
  for (const r of ROTAS.filter((x) => x.tab)) {
    tb.appendChild(el("button", {
      dataset: { rota: r.id }, type: "button",
      onclick: () => { location.hash = `#/${r.id}`; },
    }, [el("i", { texto: r.ic }), r.rot]));
  }
}

function marcarAtivo(id) {
  for (const n of document.querySelectorAll("[data-rota]")) {
    if (n.dataset.rota === id) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  }
}

/* ------------------------------------------------------------ indicador sync */
function pintarSync() {
  const box = $("#sync");
  if (!box) return;
  const nuvem = sync.modo === "nuvem";
  let classe = "sync", txt;
  if (sync.situacao === "erro") { classe += " sync--erro"; txt = "Erro ao sincronizar"; }
  else if (sync.situacao === "gravando") { classe += " sync--nuvem"; txt = "Sincronizando…"; }
  else if (nuvem) { classe += " sync--nuvem"; txt = "Na nuvem"; }
  else { classe += " sync--ok"; txt = "Salvo neste aparelho"; }
  box.className = classe;
  box.innerHTML = "";
  box.appendChild(el("span", { class: "sync__ponto" }));
  box.appendChild(el("span", { texto: txt }));
  box.title = sync.detalhe || (nuvem ? `Conectado como ${sync.email || ""}` : "Salvo automaticamente no navegador deste aparelho");
}

/* ------------------------------------------------------------------- tema */
function aplicarTema() {
  const t = estado.tema || "auto";
  const escuro = t === "escuro" || (t === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.tema = escuro ? "escuro" : "claro";
  const b = $("#btnTema");
  if (b) b.textContent = escuro ? "☀" : "🌙";
}

/* ---------------------------------------------------------------- render */
let renderando = false;

export function render() {
  if (renderando) return;
  renderando = true;
  // setTimeout e não requestAnimationFrame: rAF não dispara em aba de fundo,
  // o que deixaria o site preso em "Carregando…" até receber foco.
  setTimeout(() => {
    renderando = false;
    const r = rotaAtual();
    marcarAtivo(r.id);
    $("#tituloPagina").textContent = r.rot;
    $("#subPagina").textContent = r.sub;
    const alvo = $("#view");
    alvo.innerHTML = "";
    try {
      alvo.appendChild(r.view(dados));
    } catch (e) {
      console.error(e);
      alvo.appendChild(el("div", { class: "aviso" }, [
        el("div", {}, [el("b", { texto: "Algo quebrou nesta tela." }), String(e.message || e)]),
      ]));
    }
    pintarSync();
    aplicarTema();
    document.querySelector(".conteudo").scrollTo?.(0, 0);
    window.scrollTo(0, 0);
  }, 0);
}

/* ----------------------------------------------------------------- arranque */
async function main() {
  montarNav();

  try {
    const resp = await fetch(APP.arquivoDados, { cache: "no-cache" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    dados = await resp.json();
  } catch (e) {
    $("#view").innerHTML = "";
    $("#view").appendChild(el("div", { class: "aviso" }, [
      el("div", {}, [
        el("b", { texto: "Não consegui carregar o plano." }),
        "Verifique se o arquivo dados/plano.json está publicado junto com o site. Detalhe: " + (e.message || e),
      ]),
    ]));
    return;
  }

  await iniciar();
  aoMudar(() => { pintarSync(); });

  window.addEventListener("hashchange", render);

  $("#btnTema").addEventListener("click", () => {
    const atual = document.documentElement.dataset.tema;
    import("./store.js").then(({ mudar }) => {
      mudar((s) => { s.tema = atual === "escuro" ? "claro" : "escuro"; });
      aplicarTema();
    });
  });

  render();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").then((reg) => { reg.update(); }).catch(() => {});
  }

  if (!supabaseLigado() && !localStorage.getItem("gm-marica.avisoLocal")) {
    localStorage.setItem("gm-marica.avisoLocal", "1");
    setTimeout(() => toast("Tudo que você marcar fica salvo neste aparelho."), 900);
  }
}

main();