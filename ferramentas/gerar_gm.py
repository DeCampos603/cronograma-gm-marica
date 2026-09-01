# -*- coding: utf-8 -*-
"""
Gerador de plano de estudos para a Guarda Municipal de Maricá 2026.
Define as matérias, grade semanal, marcos e os 80 tópicos em memória.
"""

import datetime as _dt

ORDEM = [
    "Língua Portuguesa",
    "Raciocínio Lógico",
    "Noções de Informática",
    "Direito Constitucional",
    "Direito Administrativo",
    "Direito Penal",
    "Direito Proc. Penal",
    "Legislação GM",
    "Direitos Humanos",
    "Legislação Extravagante",
]

FAM = {
    "portugues":  ("#1A6B3A", "Língua Portuguesa"),
    "logica":     ("#0A4080", "Lógica e Informática"),
    "direito":    ("#7B2D00", "Direito Base"),
    "penal":      ("#5C0A0A", "Direito Penal/Proc."),
    "legGM":      ("#1C4966", "Legislação GM"),
    "legExt":     ("#3D6B0A", "Legislação Extravagante"),
}

SUB = {
    "Língua Portuguesa":     ("portugues",  "#1A6B3A", "#E8F5ED", "#0F4A27", "Português"),
    "Raciocínio Lógico":     ("logica",     "#0A4080", "#E5EEF8", "#052650", "Lógica"),
    "Noções de Informática": ("logica",     "#2B6CB0", "#E8F0FB", "#1A3F6A", "Informática"),
    "Direito Constitucional":("direito",    "#7B2D00", "#F8EDE8", "#4A1A00", "D. Const."),
    "Direito Administrativo":("direito",    "#A03B00", "#FBF0E8", "#6B2700", "D. Adm."),
    "Direito Penal":         ("penal",      "#5C0A0A", "#F5E8E8", "#3A0606", "D. Penal"),
    "Direito Proc. Penal":   ("penal",      "#7A1414", "#F8EBEB", "#4E0C0C", "D.P.P."),
    "Legislação GM":         ("legGM",      "#1C4966", "#E6EFF5", "#0E2D40", "Leg. GM"),
    "Direitos Humanos":      ("legGM",      "#1A5C7A", "#E5F2F8", "#0D3A4E", "D. Humanos"),
    "Legislação Extravagante":("legExt",    "#3D6B0A", "#EDF5E5", "#254208", "Leg. Ext."),
}

DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

MARCOS = [
    ("Início dos estudos", _dt.date(2026, 9, 1), None, "Começar a FASE 1"),
    ("Fim Fase 1 BASE", _dt.date(2026, 11, 30), None, "Virada para a FASE 2"),
    ("Fim Fase 2 APROFUNDAR", _dt.date(2027, 1, 31), None, "Virada para a FASE 3"),
    ("Fim Fase 3 SIMULADOS", _dt.date(2027, 3, 31), None, "Virada para a FASE 4"),
    ("PROVA ESTIMADA GM Maricá", _dt.date(2027, 5, 10), "GM", "Dia D"),
]

GRID = [
    # 05:30 - 08:00: Rotina matinal e café
    ("05:30–08:00", "150", "rest", [
        "☀ Acordar e café", "☀ Acordar e café", "☀ Acordar e café",
        "☀ Acordar e café", "☀ Acordar e café", "🌙 Descanso", "🌙 Descanso",
    ]),
    # 08:00 - 16:00: Trabalho
    ("08:00–16:00", "480", "rest", [
        "Trabalho", "Trabalho", "Trabalho",
        "Trabalho", "Trabalho",
        "📝 REVISÃO GERAL", "🌙 Descanso",
    ]),
    # 16:00 - 17:00: Locomoção
    ("16:00–17:00", "60", "rest", [
        "🚌 Locomoção", "🚌 Locomoção", "🚌 Locomoção",
        "🚌 Locomoção", "🚌 Locomoção", "📝 REVISÃO GERAL", "🌙 Descanso",
    ]),
    # 17:00 - 18:00: Descanso pós trabalho
    ("17:00–18:00", "60", "rest", [
        "☕ Descanso", "☕ Descanso", "☕ Descanso",
        "☕ Descanso", "☕ Descanso", "— descanso —", "🌙 Descanso",
    ]),
    # 18:00 - 19:00: Luta
    ("18:00–19:00", "60", "trn", [
        "🥋 Luta", "🥋 Luta", "🥋 Luta",
        "🥋 Luta", "🥋 Luta", "— descanso —", "— descanso —",
    ]),
    # 19:00 - 20:00: Rotina de casa
    ("19:00–20:00", "60", "rest", [
        "🧹 Rotina de casa", "🧹 Rotina de casa", "🧹 Rotina de casa",
        "🧹 Rotina de casa", "🧹 Rotina de casa", "— descanso —", "— descanso —",
    ]),
    # 20:00 - 21:00: Jantar / Preparação
    ("20:00–21:00", "60", "meal", [
        "🍽 Jantar", "🍽 Jantar", "🍽 Jantar",
        "🍽 Jantar", "🍽 Jantar", "🍽 Jantar", "🍽 Jantar",
    ]),
    # 21:00 - 22:00: Estudo Bloco 1
    ("21:00–22:00", "60", "blk", [
        "Língua Portuguesa", "Raciocínio Lógico", "Direito Penal",
        "Direito Constitucional", "Direitos Humanos", "— descanso —", "— descanso —",
    ]),
    # 22:00 - 23:00: Estudo Bloco 2
    ("22:00–23:00", "60", "blk", [
        "Noções de Informática", "Legislação GM", "Direito Proc. Penal",
        "Direito Administrativo", "Legislação Extravagante", "— descanso —", "— descanso —",
    ]),
    # 23:00 - 05:30: Sono
    ("23:00–05:30", "390", "sleep", [
        "🌙 Sono", "🌙 Sono", "🌙 Sono",
        "🌙 Sono", "🌙 Sono", "🌙 Sono", "🌙 Sono",
    ]),
]

def paint(txt, tipo):
    for m in ORDEM:
        if txt.startswith(m):
            fam, bar, t1, t2, _ = SUB[m]
            return (t1, bar, True)
    if tipo == "sleep": return ("#E8EDF5", "#4A6080", False)
    if tipo == "meal":  return ("#FBF4E8", "#7A5A00", False)
    if tipo == "trn":   return ("#E8F5ED", "#1A6B3A", True)
    if tipo == "rest":  return ("#F5F5F5", "#888888", False)
    return ("", "", False)

CARGA = [
    ("Língua Portuguesa", 1, 1.0, "Segunda 21h"),
    ("Noções de Informática", 1, 1.0, "Segunda 22h"),
    ("Raciocínio Lógico", 1, 1.0, "Terça 21h"),
    ("Legislação GM", 1, 1.0, "Terça 22h"),
    ("Direito Penal", 1, 1.0, "Quarta 21h"),
    ("Direito Proc. Penal", 1, 1.0, "Quarta 22h"),
    ("Direito Constitucional", 1, 1.0, "Quinta 21h"),
    ("Direito Administrativo", 1, 1.0, "Quinta 22h"),
    ("Direitos Humanos", 1, 1.0, "Sexta 21h"),
    ("Legislação Extravagante", 1, 1.0, "Sexta 22h"),
]

FASES = [
    ("FASE 1 · BASE",       "Set–Nov/26", "Comece a estudar tudo uma vez.",       "Construção base de conhecimento", "#E5EEF8", "#0A4080"),
    ("FASE 2 · APROFUNDAR", "Dez/26–Jan/27","Revisão + banco de questões.",        "Consolidação + prática",          "#FBF0E8", "#7B2D00"),
    ("FASE 3 · SIMULADOS",  "Fev–Mar/27", "1 simulado por sábado.",               "Treino de prova real",            "#E8F5ED", "#1A6B3A"),
    ("FASE 4 · RETA FINAL", "Abr–Mai/27", "Revisão total + TAF intensivo + descanso.", "Pico de performance",           "#F5E8E8", "#5C0A0A"),
]

MESES = [
    ("Set/26", "FASE 1 · BASE", "Início do plano", [
        ("Língua Portuguesa",     "Interpretação de texto, tipos textuais, ortografia, acentuação",          "Concluir tópicos 1–5"),
        ("Raciocínio Lógico",     "Proposições lógicas, tabela-verdade, negação, equivalências",              "Concluir tópicos 1–3"),
        ("Direito Constitucional","Princípios fundamentais, Art. 5º (direitos e deveres individuais)",         "Concluir tópicos 1–3"),
        ("Noções de Informática", "Conceitos básicos: hardware, software, sistemas operacionais",              "Concluir tópicos 1–2"),
    ]),
    ("Out/26", "FASE 1 · BASE", "Aprofundando base", [
        ("Língua Portuguesa",     "Concordância verbal/nominal, regência, pontuação, coesão e coerência",     "Concluir tópicos 6–10"),
        ("Direito Administrativo","Princípios da Adm. Pública (LIMPE), atos, poderes e agentes",               "Concluir tópicos 1–4"),
        ("Direito Penal",         "Teoria geral do crime, imputabilidade, crimes contra a vida",               "Concluir tópicos 1–4"),
        ("Noções de Informática", "Word, Excel básico, Internet, e-mail, segurança da informação",             "Concluir tópicos 3–5"),
    ]),
    ("Nov/26", "FASE 1 · BASE", "Completando a base", [
        ("Língua Portuguesa",     "Funções de linguagem, figuras de linguagem, semântica, morfologia",        "Concluir tópicos 11–15"),
        ("Direito Proc. Penal",   "Inquérito policial, ação penal, prisão em flagrante, medidas cautelares",  "Concluir tópicos 1–4"),
        ("Legislação GM",         "Lei 13.022/2014 (Estatuto GCM) completo, competências, vedações",          "Concluir todos os 5 tópicos"),
        ("Direitos Humanos",      "Conceito, gerações de direitos, DUDH, tratados internacionais",             "Concluir tópicos 1–5"),
    ]),
    ("Dez/26", "FASE 2 · APROFUNDAR", "Virada para questões", [
        ("Direito Constitucional","Art. 144 (segurança pública), revisão geral + 200 questões",                "Meta: 70% de acerto"),
        ("Direito Administrativo","Licitações básicas, contratos, responsabilidade civil + questões",          "Meta: 70% de acerto"),
        ("Direito Penal",         "Crimes contra o patrimônio, Lei de Drogas resumo, revisão",                "Meta: 70% de acerto"),
        ("Legislação Extravagante","ECA (pontos principais), Estatuto do Idoso, Lei Maria da Penha",          "Concluir tópicos 1–5"),
    ]),
    ("Jan/27", "FASE 2 · APROFUNDAR", "Questões intensivo", [
        ("Língua Portuguesa",     "Resolução de 300+ questões COSEAC/UFF e similares",                        "Meta: 80% de acerto"),
        ("Legislação Extravagante","Estatuto do Desarmamento, Lei Antidrogas, revisão geral",                 "Concluir tópicos 6–10"),
        ("Direito Proc. Penal",   "Revisão + questões: provas, nulidades, recursos",                          "Concluir tópicos 5–6"),
        ("Direitos Humanos",      "CF/88 + direitos humanos integrados, revisão completa",                    "Concluir tópicos 6–10"),
    ]),
    ("Fev/27", "FASE 3 · SIMULADOS", "Simulados semanais", [
        ("Língua Portuguesa",     "1 simulado completo por sábado + revisão de erros na segunda",              "Meta: 8/10 em Português"),
        ("Direito Penal",         "Revisão de fragilidades identificadas nos simulados",                       "Meta: 4/5 em D. Penal"),
        ("Direito Constitucional","Revisão focada no Art. 5º e Art. 144",                                    "Meta: 4/5 em D. Const."),
        ("Legislação GM",         "Revisão da Lei 13.022/2014 + comparativos com CF/88",                      "Domínio total"),
    ]),
    ("Mar/27", "FASE 3 · SIMULADOS", "Ajuste de fragilidades", [
        ("Legislação Extravagante","Revisão geral: ECA, Idoso, Maria da Penha, Drogas, Desarmamento",         "Meta: 6/7 em Leg. Ext."),
        ("Raciocínio Lógico",     "Revisão de lógica proposicional + quantificadores + raciocínio",           "Meta: 4/5 em Lógica"),
        ("Direito Administrativo","Revisão focada em agentes públicos, atos, improbidade",                    "Meta: 4/5 em D. Adm."),
        ("Direitos Humanos",      "Casos práticos, legislação integrada, simulados temáticos",                 "Meta: 5/7 em Dir. Hum."),
    ]),
    ("Abr/27", "FASE 4 · RETA FINAL", "Revisão total + TAF intensivo", [
        ("Língua Portuguesa",     "Revisão express + resolução das questões com maior erro pessoal",           "Manter acima de 80%"),
        ("Direito Penal",         "Revisão express — apenas os pontos marcados como fracos",                  "Sem novas matérias"),
        ("Legislação GM",         "Leitura integral da Lei 13.022/2014 + CF/88 Art. 144",                     "Revisão intensiva"),
        ("Legislação Extravagante","Revisão das leis extravagantes com flash cards",                          "Meta final: 80% acerto"),
    ]),
    ("Mai/27", "FASE 4 · PICO", "Semana da prova", [
        ("Língua Portuguesa",     "Leitura leve, apenas revisão de regras gramaticais-chave",                 "Manutenção — não forçar"),
        ("Legislação GM",         "Leitura da Lei 13.022/2014 uma vez mais com calma",                       "Consolidação final"),
        ("Direito Constitucional","Revisão dos artigos mais cobrados: 5º, 37, 144",                           "Manutenção"),
        ("Direitos Humanos",      "Revisão dos princípios e tratados principais",                             "Manutenção"),
    ]),
]

TOP = [
    # Língua Portuguesa (15 tópicos)
    ("Língua Portuguesa", "Compreensão de Texto", "Interpretação e compreensão de textos", "GM", "FASE 1 · BASE", "Set/26"),
    ("Língua Portuguesa", "Compreensão de Texto", "Tipologia textual (narrativo, descritivo, argumentativo, injuntivo)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Língua Portuguesa", "Compreensão de Texto", "Inferências e implícitos no texto", "GM", "FASE 1 · BASE", "Set/26"),
    ("Língua Portuguesa", "Compreensão de Texto", "Coesão e coerência textual", "GM", "FASE 1 · BASE", "Set/26"),
    ("Língua Portuguesa", "Gramática", "Ortografia oficial (Acordo de 2009)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Língua Portuguesa", "Gramática", "Acentuação gráfica", "GM", "FASE 1 · BASE", "Out/26"),
    ("Língua Portuguesa", "Gramática", "Emprego das classes gramaticais", "GM", "FASE 1 · BASE", "Out/26"),
    ("Língua Portuguesa", "Gramática", "Concordância verbal", "GM", "FASE 1 · BASE", "Out/26"),
    ("Língua Portuguesa", "Gramática", "Concordância nominal", "GM", "FASE 1 · BASE", "Out/26"),
    ("Língua Portuguesa", "Gramática", "Regência verbal e nominal", "GM", "FASE 1 · BASE", "Out/26"),
    ("Língua Portuguesa", "Gramática", "Pontuação", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Língua Portuguesa", "Gramática", "Crase", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Língua Portuguesa", "Gramática", "Significação das palavras (sinonímia, antonímia, polissemia)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Língua Portuguesa", "Gramática", "Figuras de linguagem", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Língua Portuguesa", "Gramática", "Funções da linguagem", "GM", "FASE 1 · BASE", "Nov/26"),

    # Raciocínio Lógico (8 tópicos)
    ("Raciocínio Lógico", "Lógica Proposicional", "Proposições lógicas e conectivos", "GM", "FASE 1 · BASE", "Set/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Tabela-verdade", "GM", "FASE 1 · BASE", "Set/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Negação de proposições", "GM", "FASE 1 · BASE", "Set/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Equivalências lógicas", "GM", "FASE 1 · BASE", "Set/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Argumentos dedutivos (validade e falácias)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Silogismos", "GM", "FASE 1 · BASE", "Out/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Lógica quantitativa (conjuntos, diagramas de Venn)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Raciocínio Lógico", "Lógica Proposicional", "Raciocínio sequencial e padrões", "GM", "FASE 1 · BASE", "Out/26"),

    # Noções de Informática (5 tópicos)
    ("Noções de Informática", "TI Básica", "Conceitos de hardware e software", "GM", "FASE 1 · BASE", "Set/26"),
    ("Noções de Informática", "TI Básica", "Sistemas operacionais (Windows 10/11)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Noções de Informática", "TI Básica", "Editores de texto (Word) e planilhas (Excel) básico", "GM", "FASE 1 · BASE", "Out/26"),
    ("Noções de Informática", "TI Básica", "Internet, navegadores e e-mail", "GM", "FASE 1 · BASE", "Out/26"),
    ("Noções de Informática", "TI Básica", "Segurança da informação e LGPD", "GM", "FASE 1 · BASE", "Out/26"),

    # Direito Constitucional (8 tópicos)
    ("Direito Constitucional", "CF/88", "Princípios fundamentais da República (Arts. 1º–4º)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Direito Constitucional", "CF/88", "Direitos e deveres individuais e coletivos (Art. 5º — completo)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Direito Constitucional", "CF/88", "Direitos sociais (Arts. 6º–11)", "GM", "FASE 1 · BASE", "Set/26"),
    ("Direito Constitucional", "CF/88", "Organização do Estado (Arts. 18–36)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Constitucional", "CF/88", "Administração Pública — princípios (Art. 37)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Constitucional", "CF/88", "Segurança Pública (Art. 144)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Constitucional", "CF/88", "Ordem social — saúde, educação, seguridade", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Constitucional", "CF/88", "Controle de constitucionalidade (noções)", "GM", "FASE 1 · BASE", "Nov/26"),

    # Direito Administrativo (8 tópicos)
    ("Direito Administrativo", "Adm. Pública", "Princípios da Administração Pública (LIMPE + outros)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Administrativo", "Adm. Pública", "Poderes administrativos", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Administrativo", "Adm. Pública", "Atos administrativos (elementos, atributos, espécies)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Administrativo", "Adm. Pública", "Agentes públicos — cargo, emprego e função", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Administrativo", "Adm. Pública", "Regime disciplinar e responsabilidade", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Administrativo", "Adm. Pública", "Bens públicos", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Administrativo", "Adm. Pública", "Improbidade administrativa (Lei 8.429/1992)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Administrativo", "Adm. Pública", "Controle da Administração Pública", "GM", "FASE 1 · BASE", "Nov/26"),

    # Direito Penal (8 tópicos)
    ("Direito Penal", "D. Penal Geral e Especial", "Aplicação da lei penal e princípios", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Teoria geral do crime (conduta, tipicidade, ilicitude, culpabilidade)", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Crimes dolosos e culposos, tentativa e consumação", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Excludentes de ilicitude e culpabilidade", "GM", "FASE 1 · BASE", "Out/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Penas: espécies, aplicação e extinção da punibilidade", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Crimes contra a vida (Arts. 121–128 CP)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Crimes contra o patrimônio (Arts. 155–183 CP)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Penal", "D. Penal Geral e Especial", "Crimes contra a Administração Pública", "GM", "FASE 1 · BASE", "Nov/26"),

    # Direito Proc. Penal (6 tópicos)
    ("Direito Proc. Penal", "DPP", "Inquérito policial: conceito, características e procedimentos", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Proc. Penal", "DPP", "Ação penal pública e privada", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Proc. Penal", "DPP", "Prisão em flagrante delito", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Proc. Penal", "DPP", "Medidas cautelares pessoais (prisão preventiva, temporária)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direito Proc. Penal", "DPP", "Provas no processo penal", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Direito Proc. Penal", "DPP", "Nulidades processuais", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),

    # Legislação GM (5 tópicos)
    ("Legislação GM", "Lei 13.022/2014", "Estatuto Geral das GMs (Lei 13.022/2014) — princípios e competências", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Legislação GM", "Lei 13.022/2014", "Atribuições e limites de atuação da Guarda Municipal", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Legislação GM", "Lei 13.022/2014", "Vedações e deveres dos guardas (Lei 13.022/2014)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Legislação GM", "Lei 13.022/2014", "Armamento e uso progressivo da força", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Legislação GM", "Lei 13.022/2014", "Guarda Municipal e segurança pública municipal (Art. 144 §8 CF/88)", "GM", "FASE 1 · BASE", "Nov/26"),

    # Direitos Humanos (10 tópicos)
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Conceito e gerações de direitos humanos", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Declaração Universal dos Direitos Humanos (DUDH)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Pacto de São José da Costa Rica (CADH)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Sistema interamericano de proteção dos DH", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Princípios de uso da força e armas de fogo (ONU)", "GM", "FASE 1 · BASE", "Nov/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Código de Conduta para funcionários responsáveis pela aplicação da lei (ONU)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Dignidade da pessoa humana na CF/88", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Proteção da criança e do adolescente (ECA — DH)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Proteção da mulher (Lei Maria da Penha — DH)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Direitos Humanos", "Direitos Humanos Intl e Nacional", "Direitos dos idosos (Estatuto do Idoso — DH)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),

    # Legislação Extravagante (7 tópicos)
    ("Legislação Extravagante", "Leis Especiais", "ECA — Estatuto da Criança e do Adolescente (Lei 8.069/1990)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Legislação Extravagante", "Leis Especiais", "Estatuto do Idoso (Lei 10.741/2003)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Legislação Extravagante", "Leis Especiais", "Lei Maria da Penha (Lei 11.340/2006)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Legislação Extravagante", "Leis Especiais", "Lei de Drogas (Lei 11.343/2006)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Legislação Extravagante", "Leis Especiais", "Estatuto do Desarmamento (Lei 10.826/2003)", "GM", "FASE 2 · APROFUNDAR", "Dez/26"),
    ("Legislação Extravagante", "Leis Especiais", "Lei de Tortura (Lei 9.455/1997)", "GM", "FASE 2 · APROFUNDAR", "Jan/27"),
    ("Legislação Extravagante", "Leis Especiais", "Lei de Abuso de Autoridade (Lei 13.869/2019)", "GM", "FASE 2 · APROFUNDAR", "Jan/27"),
]

TAF = {
    "abdominal_rep": 25,
    "flexao_rep": 20,
    "corrida_100m_seg": 22,
    "corrida_2000m": True,
    "corrida_min": None,
    "natacao_seg": None,
}