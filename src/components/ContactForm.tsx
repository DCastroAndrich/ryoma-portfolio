import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "./Button";

type ProjectType =
  | ""
  | "Landing/Web Institucional"
  | "E-Commerce"
  | "Plataforma Web / App"
  | "Backend / API"
  | "Consultoría / Auditoría"
  | "Otro";

type Budget = "" | "< $1.000" | "$1.000 - $3.000" | "$3.000 - $7.000" | "> $7.000";
type Timeline = "" | "1-4 Semanas" | "1-2 Meses" | "3+ Meses" | "A definir";

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
  budget: Budget;
  timeline: Timeline;
  message: string;
  privacyAccepted: boolean;
  _honeypot: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const PROJECT_TYPES: Array<{ value: ProjectType; label: string }> = [
  { value: "", label: "Seleccioná una opción." },
  { value: "Landing/Web Institucional", label: "Landing/Web Institucional" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "Plataforma Web / App", label: "Plataforma Web / App" },
  { value: "Backend / API", label: "Backend / API" },
  { value: "Consultoría / Auditoría", label: "Consultoría / Auditoría" },
  { value: "Otro", label: "Otro" },
];

const BUDGETS: Array<{ value: Budget; label: string }> = [
  { value: "", label: "Seleccioná un presupuesto." },
  { value: "< $1.000", label: "< $1.000" },
  { value: "$1.000 - $3.000", label: "$1.000 - $3.000" },
  { value: "$3.000 - $7.000", label: "$3.000 - $7.000" },
  { value: "> $7.000", label: "> $7.000" },
];

const TIMELINES: Array<{ value: Timeline; label: string }> = [
  { value: "", label: "Seleccioná un plazo estimado." },
  { value: "1-4 Semanas", label: "1-4 Semanas" },
  { value: "1-2 Meses", label: "1-2 Meses" },
  { value: "3+ Meses", label: "3+ Meses" },
  { value: "A definir", label: "A definir" },
];

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "El nombre es requerido.";

  if (!data.email.trim()) {
    errors.email = "El email es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresá un email válido.";
  }

  if (!data.projectType) errors.projectType = "Seleccioná un tipo de proyecto.";
  if (!data.timeline) errors.timeline = "Seleccioná un plazo estimado.";
  if (!data.privacyAccepted) {
    errors.privacyAccepted = "Debés aceptar la política de privacidad.";
  }

  return errors;
}

function fieldClassName(hasError?: boolean) {
  return [
    "border-accent/35 font-body text-text-primary placeholder:text-text-primary/35 hover:border-accent/55 focus:border-accent/60 focus:ring-accent/20 flex w-full rounded-2xl border bg-white/3 px-4 py-3 text-sm transition outline-none focus:ring-2 sm:text-base",
    hasError ? "border-red-400/70 focus:ring-red-400/20" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function labelClassName() {
  return "text-text-primary/90 font-body text-sm";
}

function errorClassName() {
  return "text-sm text-red-300";
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    privacyAccepted: false,
    _honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.currentTarget;

    const nextValue =
      type === "checkbox" ? (e.currentTarget as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (submitError) setSubmitError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Error al enviar el mensaje. Intentá de nuevo.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado. Intentá de nuevo o escribime directamente a hola@ryomadev.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-accent/20 bg-white/3 flex flex-col items-start gap-4 rounded-3xl border p-6 sm:p-8">
        <div className="bg-accent/12 text-accent flex h-12 w-12 items-center justify-center rounded-full">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h3 className="font-heading text-text-primary text-xl">
            Consulta enviada.
          </h3>
          <p className="font-body text-text-primary/80">
            Te respondo dentro de las próximas 48 horas hábiles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      <input
        type="text"
        name="_honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={formData._honeypot}
        onChange={handleChange}
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          height: 0,
          width: 0,
          pointerEvents: "none",
        }}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClassName()}>
            Nombre *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={fieldClassName(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            autoComplete="name"
          />
          {errors.name && (
            <span id="name-error" className={errorClassName()} role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelClassName()}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={fieldClassName(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            autoComplete="email"
          />
          {errors.email && (
            <span id="email-error" className={errorClassName()} role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="company" className={labelClassName()}>
          Empresa / Proyecto (opcional)
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          className={fieldClassName()}
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className={labelClassName()}>
            Tipo de proyecto *
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className={fieldClassName(!!errors.projectType)}
            aria-invalid={!!errors.projectType}
            aria-describedby={errors.projectType ? "projectType-error" : undefined}
          >
            {PROJECT_TYPES.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <span id="projectType-error" className={errorClassName()} role="alert">
              {errors.projectType}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className={labelClassName()}>
            Presupuesto
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={fieldClassName()}
          >
            {BUDGETS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="timeline" className={labelClassName()}>
          Plazo estimado *
        </label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={handleChange}
          className={fieldClassName(!!errors.timeline)}
          aria-invalid={!!errors.timeline}
          aria-describedby={errors.timeline ? "timeline-error" : undefined}
        >
          {TIMELINES.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.timeline && (
          <span id="timeline-error" className={errorClassName()} role="alert">
            {errors.timeline}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClassName()}>
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`${fieldClassName()} min-h-35 resize-y`}
          placeholder="Contame en pocas palabras qué necesitás, qué objetivo tenés y para cuándo te gustaría arrancar."
        />
      </div>

      <div className={`flex flex-col gap-2 ${errors.privacyAccepted ? "pt-1" : ""}`}>
        <label className="text-text-primary/85 flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="privacyAccepted"
            className="text-accent focus:ring-accent/30 mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
            checked={formData.privacyAccepted}
            onChange={handleChange}
            aria-invalid={!!errors.privacyAccepted}
            aria-describedby={errors.privacyAccepted ? "privacy-error" : undefined}
          />
          <span className="font-body leading-relaxed">
            Acepto que mis datos sean usados para contactarme según la{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-body underline decoration-white/35 underline-offset-2 hover:decoration-accent"
            >
              Política de privacidad.
            </a>
          </span>
        </label>

        {errors.privacyAccepted && (
          <span id="privacy-error" className={errorClassName()} role="alert">
            {errors.privacyAccepted}
          </span>
        )}
      </div>

      {/* Error general del servidor */}
      {submitError && (
        <div
          className="rounded-2xl border border-red-400/30 bg-red-400/5 px-4 py-3"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-body text-sm text-red-300">{submitError}</p>
        </div>
      )}

      <div className="pt-2">
        <Button
          fullWidth
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "ENVIANDO..." : "ENVIAR CONSULTA"}
        </Button>
      </div>
    </form>
  );
}