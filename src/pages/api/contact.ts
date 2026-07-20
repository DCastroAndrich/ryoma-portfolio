import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const FROM_ADDRESS = "Formulario Ryōma <hola@ryomadev.com>";

export const POST: APIRoute = async ({ request, locals }) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://ryomadev.com",
  };

  const runtime = (locals as App.Locals).runtime;
  const env = runtime?.env ?? import.meta.env;

  const RESEND_API_KEY = env.RESEND_API_KEY;
  const CONTACT_EMAIL = env.CONTACT_EMAIL;

  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    console.error("[contact] Variables de entorno faltantes:", {
      hasKey: !!RESEND_API_KEY,
      hasEmail: !!CONTACT_EMAIL,
    });
    return new Response(JSON.stringify({ error: "Configuración del servidor incompleta." }), {
      status: 500,
      headers,
    });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload inválido." }), { status: 400, headers });
  }

  const { name, email, company, projectType, budget, timeline, message, _honeypot } = body;

  if (_honeypot) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  if (!name?.trim() || !email?.trim() || !projectType?.trim() || !timeline?.trim()) {
    return new Response(JSON.stringify({ error: "Faltan campos requeridos." }), {
      status: 400,
      headers,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "El email no es válido." }), {
      status: 400,
      headers,
    });
  }

  if (message && message.length > 5000) {
    return new Response(JSON.stringify({ error: "El mensaje supera el límite de caracteres." }), {
      status: 400,
      headers,
    });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `Consulta de ${s(name)} — ${s(projectType)}`,
      html: buildEmailHtml({ name, email, company, projectType, budget, timeline, message }),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return new Response(
        JSON.stringify({ error: "No se pudo enviar. Intentá de nuevo en unos minutos." }),
        { status: 502, headers },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    console.error("[contact] Error inesperado:", err);
    return new Response(JSON.stringify({ error: "Error interno. Intentá más tarde." }), {
      status: 500,
      headers,
    });
  }
};

function s(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface EmailData {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline: string;
  message?: string;
}

function row(label: string, value?: string): string {
  if (!value?.trim()) return "";
  return `
    <tr>
      <td style="padding:10px 0;color:#a0a0b0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;font-size:15px;color:#e2e2e2;">${value}</td>
    </tr>`;
}

function buildEmailHtml(d: EmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="utf-8"><title>Nueva consulta</title></head>
    <body style="margin:0;padding:24px;background:#080710;font-family:'Segoe UI',system-ui,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#0f0e12;border-radius:12px;overflow:hidden;border:1px solid #1e1e2e;">
        <div style="background:linear-gradient(135deg,#c026d3 0%,#06b6d4 100%);padding:28px 32px;">
          <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.1em;">ryomadev.com</p>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-.02em;">Nueva consulta recibida</h1>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${row("Nombre", s(d.name))}
            ${row("Email", `<a href="mailto:${s(d.email)}" style="color:#c026d3;text-decoration:none;">${s(d.email)}</a>`)}
            ${row("Empresa", s(d.company))}
            ${row("Proyecto", s(d.projectType))}
            ${row("Presupuesto", s(d.budget))}
            ${row("Plazo", s(d.timeline))}
            ${d.message?.trim() ? row("Mensaje", `<span style="white-space:pre-wrap;">${s(d.message)}</span>`) : ""}
          </table>
        </div>
        <div style="padding:16px 32px 24px;border-top:1px solid #1e1e2e;">
          <p style="margin:0;font-size:12px;color:#606070;">
            Respondé directamente a este email para contactar a ${s(d.name)}.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
