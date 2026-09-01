# Cronograma GM Maricá — Guarda Municipal 2026

Site de plano de estudos pessoal para o concurso da **Guarda Municipal de Maricá (GCM)** 2026/2027.

Funciona como um **PWA offline-first**: depois de aberto uma vez com internet, o candidato pode usar sem conexão, em qualquer celular ou computador. Não há servidor próprio — tudo roda no navegador e opcionalmente sincroniza via Supabase.

---

## 🎯 O que é este site

| Tela | O que faz |
|---|---|
| **Hoje** | Mostra os blocos de estudo do dia, com checkbox de feito |
| **Painel** | KPIs de progresso, contadores de dias restantes e horas acumuladas |
| **Grade Semanal** | Visão compacta da semana inteira |
| **Mensal** | Calendário com carga horária por dia |
| **Conteúdo** | Programa completo por matéria, com controle de tópico a tópico |
| **Semanas** | Linha do tempo de semanas de estudo |
| **Registros** | Histórico detalhado de sessões |
| **Ajustes** | Datas do concurso, meta diária, conexão Supabase |

---

## 💾 Como o progresso é salvo

Por padrão, tudo fica no **`localStorage`** do navegador — sem cadastro, sem servidor.

Para sincronizar entre dispositivos (celular + computador), configure o Supabase na tela de Ajustes:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com)
2. Cole a **URL** e a **chave anônima** na tela de Ajustes
3. O site sincroniza automaticamente em tempo real

> **Privacidade:** o site bloqueia crawlers (`robots.txt`), não carrega nada externo e não envia dados para terceiros. O Supabase é opcional.

---

## 🚀 Publicar no GitHub Pages

```bash
# 1. Faça fork ou clone deste repositório
git clone https://github.com/DeCampos603/cronograma-gm-marica.git

# 2. Nas configurações do repositório no GitHub:
#    Settings → Pages → Source: "Deploy from a branch"
#    Branch: main / docs

# 3. O site estará em:
#    https://decampos603.github.io/cronograma-gm-marica/
```

O arquivo `.nojekyll` na pasta `docs/` garante que o GitHub Pages sirva os arquivos como estático puro, sem processar como Jekyll.

---

## 🗄️ Supabase (opcional)

Se quiser sincronizar entre dispositivos:

```sql
-- Execute no SQL Editor do Supabase
create table registros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  data date not null,
  materia text not null,
  topico text,
  minutos int not null default 0,
  feito boolean default false,
  criado_em timestamptz default now()
);

alter table registros enable row level security;

create policy "usuarios veem só seus dados"
  on registros for all
  using (auth.uid() = user_id);
```

Ative **Email Auth** no painel do Supabase. Na tela de Ajustes do app, informe a URL e a chave anon.

---

## 📁 Estrutura do projeto

```
Cronograma-GM-Marica/
├── docs/                    ← raiz publicada no GitHub Pages
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── sw.js                ← service worker (offline)
│   ├── robots.txt
│   ├── .nojekyll
│   ├── assets/
│   │   ├── css/app.css      ← toda a UI (design tokens + componentes)
│   │   └── icons/icone.svg
│   └── js/
│       ├── app.js           ← bootstrap, roteamento, SW
│       ├── config.js        ← plano de estudos (EDITE AQUI)
│       ├── store.js         ← estado e persistência
│       ├── ui.js            ← helpers de renderização
│       └── views/           ← uma view por tela
│           ├── hoje.js
│           ├── painel.js
│           ├── grade.js
│           ├── mensal.js
│           ├── conteudo.js
│           ├── semanas.js
│           ├── registros.js
│           └── ajustes.js
└── README.md
```

---

## ✏️ Como mudar o plano de estudos

Edite o arquivo `docs/js/config.js`. Ele exporta:

- **`CONCURSO`** — nome, data da prova, carga horária diária
- **`MATERIAS`** — lista de matérias com pesos e tópicos
- **`CRONOGRAMA`** — distribuição semanal (qual matéria em qual dia)

Não é necessário recompilar nada — o arquivo é ES Module puro.

---

## 🖥️ Rodar localmente

```bash
python -m http.server 8132 --directory docs
# Abra: http://localhost:8132
```

Qualquer servidor HTTP estático funciona. O Python vem pré-instalado no Windows 11 / macOS / Linux.

---

## 🏗️ Decisões de projeto

| Decisão | Escolha | Motivo |
|---|---|---|
| Framework JS | Nenhum (ES Modules vanilla) | Zero dependências, zero build, abre offline |
| CSS | Custom properties + vanilla | Sem Tailwind/Bootstrap — controle total dos tokens |
| Persistência | localStorage + Supabase opcional | Funciona sem servidor; sync é opt-in |
| Hospedagem | GitHub Pages | Gratuito, HTTPS automático, zero configuração |
| Offline | Service Worker (rede primeiro) | Sempre vê versão atualizada; funciona no avião |
| Privacidade | noindex + no-referrer + CSP | Concurso pessoal, sem exposição de dados |

---

*Feito com 🟢 verde-guarda para o concurso GCM Maricá 2026.*