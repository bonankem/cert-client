/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Where the Vite dev server proxies /api (default http://localhost:4000). */
  readonly VITE_API_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
