/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_SUPPORT_EMAIL: string;
  readonly VITE_PROXY_TARGET: string;
  readonly VITE_PORT: string;
  readonly VITE_ASSISTANT_NAME: string;
  readonly VITE_DEFAULT_USER_ID: string;
  readonly VITE_DEFAULT_USER_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
