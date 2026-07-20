/// <reference types="astro/client" />

interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
