/* Tela GRADE — a semana inteira, hora a hora, e como ela muda por fase. */

import { el, cartao, indiceDia } from "../ui.js";

const ICONE = { curso: "🎓", rev: "🔁", meal: "🍽", rest: "☕", trn: "🏃",
                free: "📵", sleep: "🌙", blk: "📚" };

export function viewGrade(d) {
  const frag = document.createDocumentFragment();

  const alvo = el("div");

  function pintar() {
    alvo.innerHTML = "";
    const linhas = d.grade;
    alvo.appendChild(cartao(
      "Semana normal — blocos noturnos",
      "Grade focada para quem trabalha durante o dia. Blocos noturnos durante a semana, sábado para simulado e revisão, domingo livre.",
      [tabelaGrade(d, linhas)], null, true
    ));
  }

  frag.appendChild(alvo);
  pintar();

  /* ---- carga por matéria ---- */
  const listaCarga = (d.carga && d.carga.length) ? d.carga : (d.ordem || []).map((m) => {
    return {
      materia: m,
      blocos: 1,
      horas: 1.0,
      onde: "Seg–Sex 21h ou 22h",
    };
  });

  frag.appendChild(cartao("Quantas horas cada matéria recebe",
    "Distribuição da carga horária semanal por matéria.", [
      el("div", { class: "tabela-wrap" }, [
        el("table", { class: "tb" }, [
          el("thead", {}, [el("tr", {}, [
            el("th"), el("th", { texto: "Matéria" }), el("th", { class: "cen", texto: "Blocos" }),
            el("th", { class: "cen", texto: "Horas" }), el("th", { texto: "Serve para" }),
            el("th", { texto: "Onde aparece" }),
          ])]),
          el("tbody", {}, listaCarga.map((c) => {
            const matInfo = d.materias?.[c.materia];
            const cor = matInfo ? matInfo.barra : "var(--ink-1)";
            const fam = (matInfo && d.familias?.[matInfo.familia]) ? d.familias[matInfo.familia] : { rotulo: "Geral" };
            return el("tr", {}, [
              el("td", { estilo: { width: "6px", padding: "0", background: cor } }),
              el("td", {}, [el("b", { estilo: { color: cor }, texto: c.materia })]),
              el("td", { class: "cen", texto: c.blocos }),
              el("td", { class: "cen", texto: c.horas.toFixed(1).replace(".", ",") + " h" }),
              el("td", { estilo: { fontSize: "11.5px", color: "var(--ink-2)" }, texto: fam.rotulo }),
              el("td", { estilo: { fontSize: "12px", color: "var(--ink-2)" }, texto: c.onde }),
            ]);
          })),
        ]),
      ]),
    ], null, true));

  /* ---- fases ---- */
  frag.appendChild(cartao("Como a grade muda ao longo do ano",
    "Mesmos horários — só as matérias trocam de lugar conforme a prova se aproxima.",
    d.fases.map((f) => el("details", { class: "acordeao" }, [
      el("summary", {}, [
        el("span", { texto: f.nome }),
        el("span", { class: "chip", estilo: { marginLeft: "8px" }, texto: f.periodo }),
      ]),
      el("div", {}, [
        el("p", { estilo: { fontSize: "13px" } }, [el("b", { texto: "O que muda: " }), f.muda]),
        el("p", { estilo: { fontSize: "12.5px", color: "var(--ink-2)", margin: "0" } }, [
          el("b", { texto: "Por quê: " }), f.porque,
        ]),
      ]),
    ]))));

  /* ---- regra dos blocos ---- */
  frag.appendChild(el("div", { class: "aviso" }, [
    el("div", {}, [
      el("b", { texto: "Regra dos blocos" }),
      "25 min de estudo → 5 min escrevendo o resumo → repetir. Todo bloco de exercícios termina com o erro anotado no caderno de erros. Nunca comece assunto novo depois das 21h — a última hora do dia é sempre revisão.",
    ]),
  ]));

  return frag;
}

function tabelaGrade(d, linhas) {
  const hoje = indiceDia();
  const grade = el("div", { class: "grade" });

  const cab = el("div", { class: "grade__lin" }, [
    el("div", { class: "grade__cab", texto: "HORÁRIO" }),
    el("div", { class: "grade__cab", texto: "" }),
    ...d.dias.map((dia, i) => el("div", {
      class: `grade__cab ${i === 6 ? "grade__cab--dom" : ""}`,
      estilo: i === hoje ? { boxShadow: "inset 0 -3px 0 var(--gold)" } : {},
      texto: dia,
    })),
  ]);
  grade.appendChild(cab);

  for (const l of linhas) {
    const lin = el("div", { class: `grade__lin ${l.tipo === "blk" ? "grade__lin--bloco" : ""}` }, [
      el("div", { class: "grade__h", texto: l.h }),
      el("div", { class: "grade__ic", texto: ICONE[l.tipo] || "" }),
    ]);
    for (let i = 0; i < 7; i++) {
      const c = l.cores[i];
      lin.appendChild(el("div", {
        class: "grade__cel",
        estilo: {
          background: c.bg.startsWith("#") ? c.bg : "#" + c.bg,
          color: c.fg.startsWith("#") ? c.fg : "#" + c.fg,
          fontWeight: c.bold ? "650" : "400",
          outline: i === hoje ? "2px solid var(--gold)" : "none",
          outlineOffset: "-2px",
        },
        texto: l.dias[i],
      }));
    }
    grade.appendChild(lin);
  }
  return el("div", { class: "tabela-wrap", estilo: { padding: "14px" } }, [grade]);
}
