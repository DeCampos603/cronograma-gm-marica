/* Tela SEMANAS — o registro das 38 semanas. */

import { el, cartao, campoEditavel, inicioDaSemana, somarDias, fCurta, numeroSemana,
         HOJE, pct, num, soma, n1, nInt, chip } from "../ui.js";
import { estado, mudar, semana } from "../store.js";

const FASE_MES = {
  "Set/26": "FASE 1 · BASE", "Out/26": "FASE 1 · BASE", "Nov/26": "FASE 1 · BASE",
  "Dez/26": "FASE 2 · APROFUNDAR", "Jan/27": "FASE 2 · APROFUNDAR",
  "Fev/27": "FASE 3 · SIMULADOS", "Mar/27": "FASE 3 · SIMULADOS",
  "Abr/27": "FASE 4 · RETA FINAL", "Mai/27": "FASE 4 · PICO",
};
const MES_ABR = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const HORAS_PLANO = 14;

export function viewSemanas(d) {
  const frag = document.createDocumentFragment();
  const atual = numeroSemana(estado.datas.inicio, HOJE());
  let sóPreenchidas = false;

  const corpo = el("div");

  frag.appendChild(el("div", { class: "aviso aviso--info" }, [
    el("div", {}, [
      el("b", { texto: "Preencha no sábado, às 21h25" }),
      "É o bloco de planejamento da grade. Cinco minutos aqui é o que faz o painel dizer a verdade.",
    ]),
  ]));

  frag.appendChild(el("div", { class: "filtros", estilo: { marginBottom: "12px" } }, [
    el("button", { class: "btn", type: "button", onclick: () => { irPara(atual); } },
      [`Ir para a semana atual (${atual})`]),
    el("label", { class: "btn", estilo: { cursor: "pointer" } }, [
      el("input", { type: "checkbox", estilo: { width: "16px", height: "16px", marginRight: "6px" },
        onchange: (e) => { sóPreenchidas = e.target.checked; pintar(); } }),
      "Só semanas com registro",
    ]),
  ]));

  function irPara(n) {
    const linha = corpo.querySelector(`[data-sem="${n}"]`);
    if (linha) linha.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function pintar() {
    corpo.innerHTML = "";
    const linhas = [];
    for (let n = 1; n <= 38; n++) {
      const s = semana(n);
      if (sóPreenchidas && num(s.horas) === null) continue;
      linhas.push({ n, s });
    }

    const tb = el("table", { class: "tb" }, [
      el("thead", {}, [el("tr", {}, [
        el("th", { class: "cen", texto: "SEM." }), el("th", { texto: "Início" }),
        el("th", { texto: "Fim" }), el("th", { texto: "Mês" }),
        el("th", { texto: "Fase" }), el("th", { texto: "Meta principal da semana", estilo: { minWidth: "200px" } }),
        el("th", { class: "cen", texto: "Horas plan." }), el("th", { class: "cen", texto: "Horas feitas" }),
        el("th", { class: "cen", texto: "Aderência" }), el("th", { class: "cen", texto: "Questões feitas" }),
        el("th", { class: "cen", texto: "Questões certas" }), el("th", { class: "cen", texto: "% acerto" }),
        el("th", { class: "cen", texto: "Treinos" }),
        el("th", { class: "cen", texto: "Nota simul." }),
        el("th", { texto: "O que travou e o que ajustar", estilo: { minWidth: "200px" } }),
      ])]),
    ]);

    const tbody = el("tbody");
    for (const { n, s } of linhas) {
      const ini = inicioDaSemana(estado.datas.inicio, n);
      const fim = somarDias(ini, 6);
      const mes = mesDe(ini);
      const set = (c) => (v) => mudar((st) => { st.semanas[n] = { ...semana(n), [c]: v }; });

      const h = num(s.horas);
      const ader = h === null ? null : h / HORAS_PLANO;
      const q = num(s.questoes), c = num(s.certas);
      const ac = q ? (c || 0) / q : null;

      tbody.appendChild(el("tr", {
        dataset: { sem: n },
        estilo: n === atual ? { outline: "2px solid var(--gold)", outlineOffset: "-2px" } : {},
      }, [
        el("td", { class: "cen", estilo: { fontWeight: "700", background: "var(--navy)", color: "#fff" }, texto: n }),
        el("td", { estilo: { fontSize: "11.5px", whiteSpace: "nowrap", color: "var(--ink-2)" }, texto: fCurta(ini) }),
        el("td", { estilo: { fontSize: "11.5px", whiteSpace: "nowrap", color: "var(--ink-2)" }, texto: fCurta(fim) }),
        el("td", { estilo: { fontSize: "11.5px", whiteSpace: "nowrap", color: "var(--ink-2)" }, texto: mes }),
        el("td", {}, [el("span", { class: "chip", texto: FASE_MES[mes] || "—" })]),
        el("td", {}, [campoEditavel({ valor: s.meta, ao: set("meta"), placeholder: "o principal desta semana" })]),
        el("td", { class: "cen" }, [el("span", { texto: HORAS_PLANO })]),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.horas, tipo: "number", passo: "0.5", largura: "mini", ao: set("horas") })]),
        el("td", { class: "cen", estilo: cor(ader, 0.85, 0.7), texto: ader === null ? "—" : pct(ader) }),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.questoes, tipo: "number", largura: "mini", ao: set("questoes") })]),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.certas, tipo: "number", largura: "mini", ao: set("certas") })]),
        el("td", { class: "cen", estilo: cor(ac, 0.75, 0.6), texto: ac === null ? "—" : pct(ac) }),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.treinos, tipo: "number", largura: "mini", ao: set("treinos") })]),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.nota, tipo: "number", passo: "0.1", largura: "mini", ao: set("nota") })]),
        el("td", {}, [campoEditavel({ valor: s.obs, ao: set("obs"), placeholder: "e o que ajustar" })]),
      ]));
    }
    tb.appendChild(tbody);

    /* totais */
    const todas = Object.values(estado.semanas);
    const hs = soma(todas.map((x) => x.horas));
    const qs = soma(todas.map((x) => x.questoes));
    const cs = soma(todas.map((x) => x.certas));
    const comReg = todas.filter((x) => num(x.horas) !== null).length;

    corpo.appendChild(el("div", { class: "tabela-wrap" }, [tb]));
    corpo.appendChild(el("div", { estilo: { padding: "12px 16px", borderTop: "1px solid var(--line)", display: "flex", gap: "18px", flexWrap: "wrap", fontSize: "13px" } }, [
      el("span", {}, [el("b", { texto: nInt.format(comReg) }), " semanas registradas"]),
      el("span", {}, [el("b", { texto: n1.format(hs) }), " horas cumpridas"]),
      el("span", {}, [el("b", { texto: nInt.format(qs) }), " questões"]),
      el("span", {}, ["acerto geral ", el("b", { texto: qs ? pct(cs / qs) : "—" })]),
    ]));
  }

  frag.appendChild(cartao(null, null, [corpo], null, true));
  pintar();
  setTimeout(() => irPara(atual), 120);
  return frag;
}

function mesDe(isoStr) {
  const [a, m] = isoStr.split("-").map(Number);
  return `${MES_ABR[m - 1]}/${String(a).slice(2)}`;
}

function cor(v, bom, ruim) {
  if (v === null) return {};
  if (v >= bom) return { background: "var(--ok-bg)", color: "var(--ok-fg)", fontWeight: "650" };
  if (v < ruim) return { background: "var(--bad-bg)", color: "var(--bad-fg)", fontWeight: "650" };
  return { fontWeight: "600" };
}
