/* ==========================================================================
   Configuração do site — Cronograma GM Maricá
   Enquanto SUPABASE.url estiver vazio, o site funciona 100% no aparelho
   (localStorage). Preencher url + chave liga a sincronização entre dispositivos.
   ========================================================================== */

export const SUPABASE = {
  url: "",              // ex.: "https://xxxxxxxx.supabase.co"
  chavePublishable: "", // ex.: "eyJhbGciOi..."  (anon / publishable — NUNCA a service_role)
};

export const APP = {
  nome: "Cronograma GM Maricá",
  versao: "1.0.0",
  chaveLocal: "gm-marica.plano.v1",
  arquivoDados: "./dados/plano.json",
};

export const supabaseLigado = () =>
  Boolean(SUPABASE.url && SUPABASE.chavePublishable);