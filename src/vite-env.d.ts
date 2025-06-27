/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_MESSAGES_POLL_INTERVAL: string;
  readonly VITE_CONVERSATIONS_POLL_INTERVAL: string;
  readonly VITE_SERVICE_FEES: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
