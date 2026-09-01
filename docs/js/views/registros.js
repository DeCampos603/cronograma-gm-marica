/* Telas de registro: SIMULADOS e TAF. */

import { el, cartao, campoEditavel, iso, HOJE, pct, num, soma, n1, n2, chip, vazio, toast } from "../ui.js";
import { estado, mudar } from "../store.js";

const novoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function botaoNovo(rot, ao) {
  return el("button", { class: "btn btn--primario", type: "button", onclick: ao }, [
    el("span", { class: "btn__ic", texto: "+" }), rot,
  ]);
}

function botaoApagar(ao) {
  return el("button", {
    class: "btn btn--peq btn--fantasma", type: "button", title: "Excluir",
    estilo: { color: "var(--bad-fg)" },
    onclick: () => { if (confirm("Excluir este registro?")) ao(); },
  }, ["✕"]);
}

/* ═══════════════════════════════════════════════════════════ SIMULADOS */
export function viewSimulados(d) {
  const frag = document.createDocumentFragment();
  const MATS = ["Português", "Lógica", "Informática", "Direitos", "Legislação"];
  const MAT_MAP = {
    "Português": "Língua Portuguesa",
    "Lógica": "Raciocínio Lógico",
    "Informática": "Noções de Informática",
    "Direitos": "Direito Constitucional",
    "Legislação": "Legislação GM",
  }
  const corpo = el("div");

  function novo() {
    mudar((s) => {
      s.simulados.unshift({ id: novoId(), data: iso(HOJE()), origem: "", alvo: "GM Maricá",
                            acertos: {}, questoes: 50, fracos: "", acao: "" });
    });
    pintar(); toast("Simulado adicionado");
  }

  function pintar() {
    corpo.innerHTML = "";
    if (!estado.simulados.length) {
      corpo.appendChild(vazio("📝", "Nenhum simulado registrado. Faça um todo sábado de manhã."));
      return;
    }
    const tb = el("table", { class: "tb" }, [
      el("thead", {}, [el("tr", {}, [
        el("th", { texto: "Data" }), el("th", { texto: "Origem" }),
        ...MATS.map((m) => el("th", { class: "cen", texto: m,
          estilo: { borderTop: `3px solid ${d.materias[MAT_MAP[m]].barra}` } })),
        el("th", { class: "cen", texto: "Acertos totais" }), el("th", { class: "cen", texto: "Questões" }),
        el("th", { class: "cen", texto: "% acerto" }), el("th", { class: "cen", texto: "Nota" }),
        el("th", { texto: "Mais fracas", estilo: { minWidth: "150px"} }), el("th", { texto: "Ação da semana", estilo: { minWidth: "150px"} }), el("th"),
      ])]),
    ]);
    const tbody = el("tbody");
    for (const s of estado.simulados) {
      const set = (c) => (v) => mudar((st) => {
        const alvo = st.simulados.find((x) => x.id === s.id); if (alvo) alvo[c] = v;
      });
      const setAcerto = (m) => (v) => { mudar((st) => {
        const alvo = st.simulados.find((x) => x.id === s.id);
        if (alvo) { alvo.acertos = { ...alvo.acertos }; alvo.acertos[m] = v; }
      }); pintar(); };

      const ac = soma(MATS.map((m) => s.acertos?.[m]));
      const q = num(s.questoes);
      const p = q ? ac / q : null;
      const nota = p === null ? null : p * 100;

      tbody.appendChild(el("tr", {}, [
        el("td", {}, [campoEditavel({ valor: s.data, tipo: "date", ao: set("data") })]),
        el("td", {}, [campoEditavel({ valor: s.origem, ao: set("origem"), placeholder: "banca / ano" })]),
        ...MATS.map((m) => el("td", { class: "cen" }, [campoEditavel({
          valor: s.acertos?.[m] ?? "", tipo: "number", largura: "mini", ao: setAcerto(m),
        })])),
        el("td", { class: "cen", estilo: { fontWeight: "700" }, texto: ac || "—" }),
        el("td", { class: "cen" }, [campoEditavel({ valor: s.questoes, tipo: "number", largura: "mini", ao: (v) => { set("questoes")(v); pintar(); } })]),
        el("td", { class: "cen", estilo: { fontWeight: "650" }, texto: p === null ? "—" : pct(p) }),
        el("td", { class: "cen", estilo: notaCor(nota), texto: nota === null ? "—" : n1.format(nota) }),
        el("td", {}, [campoEditavel({ valor: s.fracos, ao: set("fracos") })]),
        el("td", {}, [campoEditavel({ valor: s.acao, ao: set("acao") })]),
        el("td", {}, [botaoApagar(() => { mudar((st) => { st.simulados = st.simulados.filter((x) => x.id !== s.id); }); pintar(); })]),
      ]));
    }
    tb.appendChild(tbody);
    corpo.appendChild(el("div", { class: "tabela-wrap" }, [tb]));

    const notas = estado.simulados.map((s) => {
      const q = num(s.questoes); if (!q) return null;
      return (soma(MATS.map((m) => s.acertos?.[m])) / q) * 100;
    }).filter((x) => x !== null);
    if (notas.length) {
      const media = notas.reduce((a, b) => a + b, 0) / notas.length;
      corpo.appendChild(el("div", { estilo: { padding: "12px 16px", borderTop: "1px solid var(--line)", fontSize: "13px" } }, [
        "Média geral: ", el("b", { texto: n1.format(media) }), " de 100 · ",
        media >= 70 ? chip("classificando", "ok") : media >= 50 ? chip("passa, sem folga") : chip("abaixo do corte", "bad"),
      ]));
    }
  }

  frag.appendChild(el("div", { class: "aviso" }, [
    el("div", {}, [
      el("b", { texto: "O corte" }),
      "Para a Guarda Municipal, a concorrência é forte. Mire acima de 70-80 pontos para sonhar com a vaga.",
    ]),
  ]));
  frag.appendChild(cartao("Simulados", "Digite os acertos por matéria; o resto é calculado.",
    [corpo], [botaoNovo("Novo simulado", novo)], true));
  pintar();
  return frag;
}

const notaCor = (n) => n === null ? {}
  : n >= 70 ? { background: "var(--ok-bg)", color: "var(--ok-fg)", fontWeight: "700" }
  : n < 50 ? { background: "var(--bad-bg)", color: "var(--bad-fg)", fontWeight: "700" }
  : { fontWeight: "650" };


/* ════════════════════════════════════════════════════════════════ TAF */
export function viewTaf(d) {
  const frag = document.createDocumentFragment();
  // GM Maricá: 100m, 2000m, flexões e abdominais
  const metaCorrida100 = 17.0, metaCorrida2000 = 12.0;
  const metaFlex = 25, metaAbd = 30;
  const corpo = el("div");

  function novo() {
    mudar((s) => {
      s.taf.unshift({ id: novoId(), data: iso(HOJE()), corrida100: "", corrida2000: "",
                      flexoes: "", abdominais: "", peso: "", obs: "" });
    });
    pintar(); toast("Treino adicionado");
  }

  function pintar() {
    corpo.innerHTML = "";
    if (!estado.taf.length) {
      corpo.appendChild(vazio("🏃", "Nenhum treino registrado. O treino físico é 3 a 5 vezes por semana."));
      return;
    }
    const tb = el("table", { class: "tb" }, [
      el("thead", {}, [el("tr", {}, [
        el("th", { texto: "Data" }),
        el("th", { class: "cen", texto: "Corrida 100m (seg)" }),
        el("th", { class: "cen", texto: "Corrida 2.000m (min)" }),
        el("th", { class: "cen", texto: "Flexões" }),
        el("th", { class: "cen", texto: "Abdominais" }),
        el("th", { class: "cen", texto: "Peso (kg)" }),
        el("th", { class: "cen", texto: "No índice?" }), el("th", { texto: "Observações" }), el("th"),
      ])]),
    ]);
    const tbody = el("tbody");
    for (const t of estado.taf) {
      const set = (c) => (v) => { mudar((st) => {
        const a = st.taf.find((x) => x.id === t.id); if (a) a[c] = v;
      }); if (c === "corrida100" || c === "corrida2000" || c === "flexoes" || c === "abdominais") pintar(); };

      const c100 = num(t.corrida100), c2000 = num(t.corrida2000);
      const fl = num(t.flexoes), ab = num(t.abdominais);
      const okC100 = c100 !== null && c100 <= metaCorrida100;
      const okC2000 = c2000 !== null && c2000 <= metaCorrida2000;
      const okFl = fl !== null && fl >= metaFlex;
      const okAb = ab !== null && ab >= metaAbd;

      tbody.appendChild(el("tr", {}, [
        el("td", {}, [campoEditavel({ valor: t.data, tipo: "date", ao: set("data") })]),
        el("td", { class: "cen", estilo: c100 === null ? {} : (okC100 ? { background: "var(--ok-bg)" } : { background: "var(--bad-bg)" }) },
          [campoEditavel({ valor: t.corrida100, tipo: "number", passo: "0.1", largura: "mini", ao: set("corrida100") })]),
        el("td", { class: "cen", estilo: c2000 === null ? {} : (okC2000 ? { background: "var(--ok-bg)" } : { background: "var(--bad-bg)" }) },
          [campoEditavel({ valor: t.corrida2000, tipo: "number", passo: "0.01", largura: "mini", ao: set("corrida2000") })]),
        el("td", { class: "cen", estilo: fl === null ? {} : (okFl ? { background: "var(--ok-bg)" } : { background: "var(--bad-bg)" }) },
          [campoEditavel({ valor: t.flexoes, tipo: "number", largura: "mini", ao: set("flexoes") })]),
        el("td", { class: "cen", estilo: ab === null ? {} : (okAb ? { background: "var(--ok-bg)" } : { background: "var(--bad-bg)" }) },
          [campoEditavel({ valor: t.abdominais, tipo: "number", largura: "mini", ao: set("abdominais") })]),
        el("td", { class: "cen" }, [campoEditavel({ valor: t.peso, tipo: "number", passo: "0.1", largura: "mini", ao: set("peso") })]),
        el("td", { class: "cen" }, [
          c100 === null && c2000 === null && fl === null && ab === null ? el("span", { texto: "—" })
            : el("div", { estilo: { display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center"} }, [
                okC100 ? chip("100m", "ok") : (c100 !== null ? chip("100m", "bad") : null),
                okC2000 ? chip("2000m", "ok") : (c2000 !== null ? chip("2000m", "bad") : null),
                okFl ? chip("flex", "ok") : (fl !== null ? chip("flex", "bad") : null),
                okAb ? chip("abd", "ok") : (ab !== null ? chip("abd", "bad") : null),
              ]),
        ]),
        el("td", {}, [campoEditavel({ valor: t.obs, ao: set("obs") })]),
        el("td", {}, [botaoApagar(() => { mudar((st) => { st.taf = st.taf.filter((x) => x.id !== t.id); }); pintar(); })]),
      ]));
    }
    tb.appendChild(tbody);
    corpo.appendChild(el("div", { class: "tabela-wrap" }, [tb]));
  }

  frag.appendChild(el("div", { class: "aviso" }, [
    el("div", {}, [
      el("b", { texto: "O TAF elimina tanto quanto a prova escrita" }),
      `Previsão dos índices: correr 100 m em até ${n1.format(metaCorrida100)} s, correr 2.000 m em até ${n1.format(metaCorrida2000)} min (12 min 0 s), fazer no mínimo ${metaFlex} flexões e ${metaAbd} abdominais. ` +
      "Tempo de corrida 2.000m em número decimal: 11,5 = 11 min 30 s.",
    ]),
  ]));
  frag.appendChild(cartao("Treinos", null, [corpo], [botaoNovo("Novo treino", novo)], true));
  pintar();
  return frag;
}
