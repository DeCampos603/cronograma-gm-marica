/* Tela HOJE — o bloco de agora em destaque e o checklist do dia. */

import { el, iso, HOJE, fExtenso, fData, indiceDia, faixaHorario, agoraMin, dias,
         chaveMes, numeroSemana, cartao, chip, toast } from "../ui.js";
import { estado, mudar } from "../store.js";

const ICONE = { curso: "🎓", rev: "🔁", meal: "🍽", rest: "☕", trn: "🏃",
                free: "📵", sleep: "🌙", blk: "📚" };

/** O texto já traz emoji? Então não prefixa outro. */
const temEmoji = (t) => /^[^\p{L}\p{N}\s]/u.test(t.trim());

function iconeDe(texto, tipo) {
  if (temEmoji(texto)) return "";
  if (/^CURSO/.test(texto)) return ICONE.curso + " ";
  return (ICONE[tipo] || "") + " ";
}

/** "segunda-feira, 3 de agosto" → "Segunda-feira, 3 de agosto" */
const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function viewHoje(d) {
  const agora = HOJE();
  const hojeIso = iso(agora);
  const di = indiceDia(agora);
  const domingo = di === 6;
  const min = agoraMin(agora);
  const marcados = estado.dia[hojeIso] || {};

  const frag = document.createDocumentFragment();

  /* ---- cabeçalho do dia ---- */
  const nSem = numeroSemana(estado.datas.inicio, agora);
  const mes = d.meses.find((m) => m.mes.replace("/26", "/26").replace("/27", "/27") === chaveMes(agora));
  const fase = mes ? mes.fase : "—";

  frag.appendChild(el("section", { class: "card" }, [
    el("div", { class: "card__corpo" }, [
      el("div", { estilo: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" } }, [
        el("h2", { estilo: { fontSize: "17px" }, texto: capitalizar(fExtenso(agora)) }),
        chip(`Semana ${nSem} de 38`),
        chip(fase),
        domingo ? chip("Descanso", "ok") : null,
      ]),
      el("div", { class: "grade-cards", estilo: { marginTop: "16px" } }, [
        contadorMini("GM MARICÁ", dias(estado.datas.prova, agora), "var(--fam-gm)"),
      ]),
    ]),
  ]));

  /* ---- foco do mês ---- */
  if (mes && !domingo) {
    const hoje = d.grade.filter((l) => l.tipo === "blk").map((l, i) => ({ l, i }));
    const materiasHoje = [...new Set(
      d.grade.map((l) => l.cores[di]?.materia).filter(Boolean)
    )];
    if (materiasHoje.length) {
      frag.appendChild(cartao(
        "O que estudar hoje, em cada matéria",
        `Foco de ${mes.mes} — ${mes.marco}`,
        materiasHoje.map((m) => {
          const it = mes.itens.find((x) => x.materia === m);
          const cor = d.materias[m].barra;
          return el("div", { estilo: { display: "flex", gap: "10px", padding: "9px 0", borderBottom: "1px solid var(--line)" } }, [
            el("span", { class: "trilho-mat", estilo: { background: cor } }),
            el("div", { estilo: { flex: "1", minWidth: "0" } }, [
              el("b", { estilo: { fontSize: "13px", color: cor }, texto: m }),
              el("div", { estilo: { fontSize: "12.5px", marginTop: "2px" }, texto: it ? it.conteudo : "—" }),
              it && it.meta && it.meta !== "—"
                ? el("div", { estilo: { fontSize: "11px", color: "var(--ink-3)", marginTop: "2px" }, texto: "Meta do mês: " + it.meta })
                : null,
            ]),
          ]);
        })
      ));
    }
  }

  /* ---- agenda do dia ---- */
  const linhas = d.grade.map((l, i) => ({ ...l, i })).filter((l) => {
    const t = l.dias[di];
    return t && !/^— descanso —$/.test(t);
  });

  const feitos = linhas.filter((l) => l.tipo === "blk" || l.tipo === "rev" || l.tipo === "curso" || l.tipo === "trn");
  const nFeitos = feitos.filter((l) => marcados[l.i]).length;

  const agenda = el("div", { class: "agenda" });
  for (const l of linhas) {
    const faixa = faixaHorario(l.h);
    const ehAgora = faixa && min >= faixa.ini && min < faixa.fim;
    const passou = faixa && min >= faixa.fim && faixa.fim < 24 * 60;
    const c = l.cores[di];
    const marcavel = ["blk", "rev", "curso", "trn"].includes(l.tipo);
    const feito = Boolean(marcados[l.i]);

    const bloco = el("div", {
      class: `bloco ${ehAgora ? "bloco--agora" : ""} ${passou && !ehAgora ? "bloco--passou" : ""} ${feito ? "bloco--feito" : ""}`,
      estilo: c && c.materia ? { borderLeft: `4px solid ${d.materias[c.materia].barra}` } : {},
    }, [
      el("div", { class: "bloco__h" }, [l.h.replace("–", "\n–")]),
      el("div", { class: "bloco__txt" }, [
        el("span", { texto: iconeDe(l.dias[di], l.tipo) + l.dias[di] }),
        ehAgora ? el("span", { class: "selo-agora", texto: "AGORA" }) : null,
        el("div", { class: "bloco__meta", texto: l.dur + (/^\d+$/.test(l.dur) ? " min" : "") }),
      ]),
      marcavel
        ? el("label", { class: "bloco__chk" }, [
            el("input", {
              type: "checkbox", checked: feito, "aria-label": "concluído",
              onchange: (e) => {
                const v = e.target.checked;
                mudar((s) => {
                  s.dia[hojeIso] = s.dia[hojeIso] || {};
                  if (v) s.dia[hojeIso][l.i] = true; else delete s.dia[hojeIso][l.i];
                });
                bloco.classList.toggle("bloco--feito", v);
                atualizaResumo();
              },
            }),
          ])
        : null,
    ]);
    agenda.appendChild(bloco);
  }

  const resumo = el("div", { estilo: { fontSize: "12.5px", color: "var(--ink-2)" } });
  function atualizaResumo() {
    const m = estado.dia[hojeIso] || {};
    const n = feitos.filter((l) => m[l.i]).length;
    resumo.textContent = `${n} de ${feitos.length} blocos concluídos hoje`;
  }
  atualizaResumo();

  frag.appendChild(cartao(
    domingo ? "Domingo — descanso" : "Sua agenda de hoje",
    domingo ? "Descanso é parte do plano. Voltar na segunda inteiro rende mais que estudar quebrado." : null,
    [resumo, el("div", { estilo: { height: "10px" } }), agenda]
  ));

  /* ---- registro rápido ---- */
  if (!domingo) {
    frag.appendChild(cartao("Registro rápido", "Atalhos para o que você faz todo dia.", [
      el("div", { estilo: { display: "flex", gap: "8px", flexWrap: "wrap" } }, [
        el("a", { class: "btn", href: "#/taf" }, ["🏃 Lançar treino"]),
        el("a", { class: "btn", href: "#/simulados" }, ["📝 Lançar simulado"]),
        el("a", { class: "btn", href: "#/conteudo" }, ["✅ Marcar tópico estudado"]),
        el("a", { class: "btn", href: "#/semanas" }, ["📈 Fechar a semana"]),
      ]),
    ]));
  }

  return frag;
}

function contadorMini(rot, n, cor) {
  const dataProva = (estado.datas && estado.datas.prova) ? estado.datas.prova : "";
  const dtFmt = (typeof fData === "function") ? fData(dataProva) : (dataProva || "—");
  return el("div", { class: "contador contador--gm" }, [
    el("div", { class: "contador__rot", texto: `PROVA DA ${rot}` }),
    el("div", { class: "contador__n",
                texto: n === null ? "—" : (n < 0 ? "realizada" : `${n} dias`) }),
    el("div", { class: "contador__u",
                texto: n === null ? "" : (n < 0 ? "prova realizada" : "dias restantes") }),
    el("div", { class: "contador__pe",
                texto: n === null || n < 0 ? dtFmt :
                       `${Math.round(n / 7)} semanas · ${dtFmt}` }),
  ]);
}