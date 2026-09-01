/* Tela CONTEÚDO — os 80 tópicos, filtros e revisão espaçada (+1, +7, +30 dias). */

import { el, cartao, campoEditavel, somarDias, fCurta, iso, HOJE, barraProgresso,
         chip, num, toast } from "../ui.js";
import { estado, mudar, topico, CONCLUIDOS } from "../store.js";

const STATUS = ["", "Não iniciado", "Em andamento", "Concluído", "Revisado"];

export function viewConteudo(d) {
  const frag = document.createDocumentFragment();
  const hoje = iso(HOJE());

  const filtro = { materia: "", fase: "", status: "", busca: "", sóVencidas: false };

  const resumo = el("div", { estilo: { marginBottom: "14px" } });
  const corpo = el("div");

  /* ---- filtros ---- */
  const barra = el("div", { class: "filtros", estilo: { marginBottom: "12px" } }, [
    campo("Buscar tópico…", (v) => { filtro.busca = v.toLowerCase(); pintar(); }),
    seletor(["", ...d.ordem], "Todas as matérias", (v) => { filtro.materia = v; pintar(); }),
    seletor(["", "FASE 1 · BASE", "FASE 2 · APROFUNDAR", "FASE 3 · SIMULADOS", "FASE 4 · RETA FINAL"], "Todas as fases", (v) => { filtro.fase = v; pintar(); }),
    seletor(STATUS, "Qualquer situação", (v) => { filtro.status = v; pintar(); }),
    el("label", { class: "btn", estilo: { cursor: "pointer" } }, [
      el("input", { type: "checkbox", estilo: { width: "16px", height: "16px", marginRight: "6px" },
        onchange: (e) => { filtro.sóVencidas = e.target.checked; pintar(); } }),
      "Só revisões vencidas",
    ]),
  ]);

  function campo(ph, ao) {
    return el("input", { type: "text", placeholder: ph, oninput: (e) => ao(e.target.value) });
  }
  function seletor(ops, rotVazio, ao) {
    return el("select", { onchange: (e) => ao(e.target.value) },
      ops.map((o) => el("option", { value: o, texto: o || rotVazio })));
  }

  /* ---- render ---- */
  function vencida(dataEstudo, st) {
    if (!dataEstudo || st === "Revisado") return false;
    return [1, 7, 30].some((n) => somarDias(dataEstudo, n) < hoje);
  }

  function pintar() {
    const lista = d.topicos.filter((t) => {
      const e = topico(t.id);
      if (filtro.materia && t.materia !== filtro.materia) return false;
      if (filtro.fase && t.prioridade !== filtro.fase) return false;
      if (filtro.status && (e.status || "") !== filtro.status) return false;
      if (filtro.sóVencidas && !vencida(e.dataEstudo, e.status)) return false;
      if (filtro.busca && !(`${t.topico} ${t.unidade} ${t.materia}`.toLowerCase().includes(filtro.busca))) return false;
      return true;
    });

    const feitos = lista.filter((t) => CONCLUIDOS.includes(topico(t.id).status)).length;
    const vencidas = d.topicos.filter((t) => vencida(topico(t.id).dataEstudo, topico(t.id).status)).length;

    resumo.innerHTML = "";
    resumo.appendChild(el("div", { estilo: { display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" } }, [
      el("span", { estilo: { fontSize: "13px", color: "var(--ink-2)" },
                   texto: `${lista.length} tópicos exibidos · ${feitos} concluídos` }),
      el("div", { estilo: { flex: "1", minWidth: "160px", maxWidth: "300px" } }, [
        barraProgresso(lista.length ? feitos / lista.length : 0, "var(--fam-gm)"),
      ]),
      vencidas
        ? el("button", { class: "chip chip--bad", estilo: { border: "0", cursor: "pointer" }, type: "button",
            onclick: () => { filtro.sóVencidas = true; barra.querySelector('input[type="checkbox"]').checked = true; pintar(); },
            texto: `${vencidas} revisões vencidas` })
        : chip("Nenhuma revisão vencida", "ok"),
    ]));

    corpo.innerHTML = "";
    if (!lista.length) {
      corpo.appendChild(el("div", { class: "vazio" }, ["Nenhum tópico com esses filtros."]));
      return;
    }

    const tb = el("table", { class: "tb" }, [
      el("thead", {}, [el("tr", {}, [
        el("th"), el("th", { texto: "Matéria" }), el("th", { texto: "Tópico", estilo: { minWidth: "260px" } }),
        el("th", { class: "cen", texto: "Fase" }), el("th", { class: "cen", texto: "Mês" }),
        el("th", { texto: "Situação", estilo: { minWidth: "130px" } }),
        el("th", { class: "cen", texto: "Estudei em" }),
        el("th", { class: "cen", texto: "Rev +1" }), el("th", { class: "cen", texto: "Rev +7" }),
        el("th", { class: "cen", texto: "Rev +30" }),
        el("th", { class: "cen", texto: "Confiança" }), el("th", { class: "cen", texto: "% acerto" }),
        el("th", { texto: "Observações", estilo: { minWidth: "180px" } }),
      ])]),
    ]);

    const tbody = el("tbody");
    for (const t of lista) {
      const e = topico(t.id);
      const cor = d.materias[t.materia].barra;
      const set = (campo) => (v) => mudar((s) => {
        s.topicos[t.id] = { ...topico(t.id), [campo]: v };
      });

      const cels = [1, 7, 30].map((n) => {
        const dt = e.dataEstudo ? somarDias(e.dataEstudo, n) : "";
        const venceu = dt && dt < hoje && e.status !== "Revisado";
        return el("td", {
          class: "cen",
          estilo: venceu ? { background: "var(--bad-bg)", color: "var(--bad-fg)", fontWeight: "650" } : {},
          texto: dt ? fCurta(dt) : "—",
        });
      });

      tbody.appendChild(el("tr", {}, [
        el("td", { estilo: { width: "6px", padding: "0", background: cor } }),
        el("td", { estilo: { fontSize: "11.5px", color: cor, fontWeight: "650", whiteSpace: "nowrap" }, texto: t.materia }),
        el("td", {}, [
          el("div", { texto: t.topico }),
          el("div", { estilo: { fontSize: "11px", color: "var(--ink-3)" }, texto: t.unidade }),
        ]),
        el("td", { class: "cen" }, [chip(t.prioridade.split(" · ")[0])]),
        el("td", { class: "cen", estilo: { fontSize: "11.5px", color: "var(--ink-3)" }, texto: t.mes }),
        el("td", {}, [campoEditavel({
          valor: e.status, opcoes: STATUS,
          ao: (v) => {
            set("status")(v);
            if (CONCLUIDOS.includes(v) && !topico(t.id).dataEstudo) {
              mudar((s) => { s.topicos[t.id] = { ...s.topicos[t.id], dataEstudo: hoje }; });
              pintar();
            }
          },
        })]),
        el("td", { class: "cen" }, [campoEditavel({
          valor: e.dataEstudo, tipo: "date", ao: (v) => { set("dataEstudo")(v); pintar(); },
        })]),
        ...cels,
        el("td", { class: "cen" }, [campoEditavel({
          valor: e.confianca, opcoes: ["", "1", "2", "3", "4", "5"], ao: set("confianca"),
        })]),
        el("td", { class: "cen" }, [campoEditavel({
          valor: e.acerto === "" ? "" : Math.round((num(e.acerto) || 0) * 100) || "",
          tipo: "number", largura: "mini", placeholder: "%",
          ao: (v) => set("acerto")(v === "" ? "" : (num(v) || 0) / 100),
        })]),
        el("td", {}, [campoEditavel({ valor: e.obs, ao: set("obs"), placeholder: "erros que se repetem" })]),
      ]));
    }
    tb.appendChild(tbody);
    corpo.appendChild(el("div", { class: "tabela-wrap" }, [tb]));
  }

  frag.appendChild(el("div", { class: "aviso aviso--info" }, [
    el("div", {}, [
      el("b", { texto: "Como usar" }),
      "Marque a situação e a data em que estudou — as três revisões (1, 7 e 30 dias) aparecem sozinhas e ficam vermelhas quando vencem. Marcar como Concluído preenche a data de hoje automaticamente.",
    ]),
  ]));
  frag.appendChild(barra);
  frag.appendChild(resumo);
  frag.appendChild(cartao(null, null, [corpo], null, true));
  pintar();
  return frag;
}