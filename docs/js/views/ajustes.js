/* Tela AJUSTES — datas-alvo, backup, sincronização e legenda. */

import { el, cartao, fData, toast, chip } from "../ui.js";
import { estado, mudar, sync, exportarJSON, importarJSON, apagarTudo, entrar, sair } from "../store.js";
import { supabaseLigado, APP } from "../config.js";
import { render } from "../app.js";

export function viewAjustes(d) {
  const frag = document.createDocumentFragment();

  /* ---- onde ficam os dados ---- */
  const nuvem = sync.modo === "nuvem";
  frag.appendChild(cartao("Onde ficam os seus dados", null, [
    el("div", { class: `aviso ${nuvem ? "aviso--ok" : "aviso--info"}` }, [
      el("div", {}, [
        el("b", { texto: nuvem ? `Sincronizado na nuvem (${sync.email})` : "Salvo neste aparelho" }),
        nuvem
          ? "Tudo que você marcar aparece também no outro aparelho em que você entrar com a mesma conta."
          : "Tudo que você marca é gravado automaticamente no navegador deste aparelho — funciona offline e sem cadastro. "
            + "Mas fica só aqui: se você limpar os dados do navegador ou trocar de celular, some. "
            + "Faça um backup de vez em quando, ou ligue a sincronização abaixo.",
      ]),
    ]),
    el("div", { estilo: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" } }, [
      el("button", { class: "btn btn--primario", type: "button", onclick: () => { exportarJSON(); toast("Backup baixado"); } },
        [el("span", { class: "btn__ic", texto: "⭳" }), "Baixar backup"]),
      el("label", { class: "btn", estilo: { cursor: "pointer" } }, [
        el("span", { class: "btn__ic", texto: "⭱" }), "Restaurar backup",
        el("input", { type: "file", accept: "application/json,.json", estilo: { display: "none" },
          onchange: async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { await importarJSON(f); toast("Backup restaurado"); render(); }
            catch (err) { alert("Não deu para restaurar: " + err.message); }
            e.target.value = "";
          } }),
      ]),
      el("button", { class: "btn btn--perigo", type: "button",
        onclick: () => {
          if (confirm("Apagar TODO o seu progresso deste aparelho? Baixe um backup antes se tiver dúvida.")) {
            apagarTudo(); toast("Progresso apagado"); render();
          }
        } }, ["Apagar tudo"]),
    ]),
    el("p", { estilo: { fontSize: "11.5px", color: "var(--ink-3)", marginTop: "10px", marginBottom: "0" },
              texto: `Última alteração: ${estado.atualizado_em ? new Date(estado.atualizado_em).toLocaleString("pt-BR") : "nenhuma ainda"}` }),
  ]));

  /* ---- sincronização ---- */
  const bloco = el("div");
  if (!supabaseLigado()) {
    bloco.appendChild(el("p", { estilo: { fontSize: "13px" } }, [
      "A sincronização entre celular e PC está ", el("b", { texto: "desligada" }),
      ". Para ligar, crie um projeto gratuito no Supabase, rode o SQL de ",
      el("code", { texto: "modelos/supabase/" }), " e preencha ", el("code", { texto: "docs/js/config.js" }),
      ". O passo a passo completo está no README do projeto.",
    ]));
    bloco.appendChild(el("p", { estilo: { fontSize: "12.5px", color: "var(--ink-2)" },
      texto: "Enquanto isso o site funciona normalmente — só não acompanha entre aparelhos." }));
  } else if (nuvem) {
    bloco.appendChild(el("p", { estilo: { fontSize: "13px" } }, [
      "Conectado como ", el("b", { texto: sync.email }), ".",
    ]));
    bloco.appendChild(el("button", { class: "btn", type: "button",
      onclick: async () => { await sair(); toast("Você saiu"); render(); } }, ["Sair da conta"]));
  } else {
    const email = el("input", { type: "email", autocomplete: "username", placeholder: "seu@email.com" });
    const senha = el("input", { type: "password", autocomplete: "current-password", placeholder: "sua senha" });
    const erro = el("div", { estilo: { color: "var(--bad-fg)", fontSize: "12.5px", marginTop: "6px" } });
    bloco.appendChild(el("form", {
      onsubmit: async (ev) => {
        ev.preventDefault();
        erro.textContent = "";
        try { await entrar(email.value.trim(), senha.value); toast("Conectado"); render(); }
        catch (e) { erro.textContent = "Não consegui entrar: " + (e.message || e); }
      },
    }, [
      el("label", { class: "campo" }, [el("span", { texto: "E-mail" }), email]),
      el("label", { class: "campo" }, [el("span", { texto: "Senha" }), senha]),
      el("button", { class: "btn btn--primario", type: "submit" }, ["Entrar e sincronizar"]),
      erro,
    ]));
  }
  frag.appendChild(cartao("Sincronizar entre celular e PC", null, [bloco]));

  /* ---- datas-alvo ---- */
  frag.appendChild(cartao("Datas-alvo",
    "A de 2027 é projeção. Corrija quando o edital oficial sair — tudo se reajusta.", [
      el("div", { class: "grade-cards" }, [
        campoData("Início do plano", "inicio"),
        campoData("Prova GM Maricá", "prova"),
      ]),
    ]));

  function campoData(rot, chave) {
    return el("label", { class: "campo" }, [
      el("span", { texto: rot }),
      el("input", {
        type: "date", value: estado.datas[chave] || "",
        onchange: (e) => { mudar((s) => { s.datas[chave] = e.target.value; }); toast("Data atualizada"); render(); },
      }),
    ]);
  }

  /* ---- legenda ---- */
  frag.appendChild(cartao("Legenda de cores",
    "O tom diz qual matéria é.", [
      el("div", { estilo: { display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,220px),1fr))" } },
        Object.entries(d.familias).map(([k, f]) =>
          el("div", {}, [
            el("div", { estilo: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" } }, [
              el("span", { estilo: { width: "14px", height: "14px", borderRadius: "4px", background: f.cor } }),
              el("b", { estilo: { fontSize: "12.5px" }, texto: f.rotulo }),
            ]),
            ...d.ordem.filter((m) => d.materias[m].familia === k).map((m) =>
              el("div", { class: "legenda__it", estilo: { marginBottom: "4px" } }, [
                el("span", { class: "legenda__cor", estilo: { background: d.materias[m].barra } }),
                el("span", { estilo: { fontSize: "12px" }, texto: m }),
              ])),
          ]))),
    ]));

  /* ---- sobre ---- */
  frag.appendChild(cartao("Sobre", null, [
    el("p", { estilo: { fontSize: "12.5px", color: "var(--ink-2)" },
      texto: `${APP.nome} · versão ${APP.versao}. Site estático, sem rastreadores e sem serviços de terceiros. `
           + "Funciona offline depois da primeira visita — dá para instalar na tela inicial do celular." }),
  ]));

  return frag;
}
