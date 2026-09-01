/* Tela PLANO MENSAL — o que estudar de cada matéria em cada mês. */

import { el, cartao, campoEditavel, chaveMes, HOJE, chip } from "../ui.js";
import { estado, mudar, mesItem } from "../store.js";

const STATUS = ["", "Não iniciado", "Em andamento", "Concluído", "Atrasado"];

export function viewMensal(d) {
  const frag = document.createDocumentFragment();
  const mesAtual = chaveMes(HOJE());

  frag.appendChild(el("div", { class: "aviso aviso--info" }, [
    el("div", {}, [
      el("b", { texto: "O plano é flexível" }),
      "Você pode reordenar ou antecipar tópicos conforme seu desempenho, mas tente seguir a carga mensal. Simulados pautam as suas revisões.",
    ]),
  ]));

  for (const m of d.meses) {
    const ehAtual = m.mes === mesAtual;
    const pico = m.fase.includes("RETA FINAL") || m.fase.includes("PICO");
    const feitos = m.itens.filter((it) => mesItem(`${m.mes}|${it.materia}`).status === "Concluído").length;

    const det = el("details", { class: "acordeao", open: ehAtual }, [
      el("summary", {}, [
        el("b", { texto: m.mes }),
        el("span", { class: `chip ${pico ? "chip--bad" : ""}`, texto: m.fase }),
        ehAtual ? el("span", { class: "chip chip--ok", texto: "mês atual" }) : null,
        el("span", { estilo: { fontSize: "11.5px", color: "var(--ink-3)", marginLeft: "4px" },
                     texto: `${feitos}/${m.itens.length}` }),
      ]),
      el("div", {}, [
        el("p", { estilo: { fontSize: "12.5px", color: "var(--ink-2)", marginBottom: "10px" }, texto: m.marco }),
        el("div", { class: "tabela-wrap" }, [
          el("table", { class: "tb" }, [
            el("thead", {}, [el("tr", {}, [
              el("th"), el("th", { texto: "Matéria" }),
              el("th", { texto: "O que estudar", estilo: { minWidth: "300px" } }),
              el("th", { texto: "Meta do mês", estilo: { minWidth: "160px" } }),
              el("th", { texto: "Situação", estilo: { minWidth: "130px" } }),
            ])]),
            el("tbody", {}, m.itens.map((it) => {
              const cor = d.materias[it.materia].barra;
              const chave = `${m.mes}|${it.materia}`;
              const fora = /^(FORA DA GRADE|Congelado|Manutenção)/.test(it.conteudo);
              return el("tr", {}, [
                el("td", { estilo: { width: "6px", padding: "0", background: cor } }),
                el("td", {}, [el("b", { estilo: { color: cor, whiteSpace: "nowrap" }, texto: it.materia })]),
                el("td", { estilo: fora ? { color: "var(--ink-3)", fontStyle: "italic" } : {}, texto: it.conteudo }),
                el("td", { estilo: { fontSize: "12px", color: "var(--ink-2)" }, texto: it.meta }),
                el("td", {}, [campoEditavel({
                  valor: mesItem(chave).status, opcoes: STATUS,
                  ao: (v) => mudar((s) => { s.meses[chave] = { ...mesItem(chave), status: v }; }),
                })]),
              ]);
            })),
          ]),
        ]),
      ]),
    ]);
    frag.appendChild(det);
  }
  return frag;
}
