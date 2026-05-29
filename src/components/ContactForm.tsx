import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from "react";
import { ChevronDown, CheckCircle2, Check } from "lucide-react";
import Button from "./Button";

/* Types */

type SelectOption = {
  value: string;
  label: string;
};

interface BrandSelectProps {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder: string;
}

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

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: ProjectType;
  budget: Budget;
  timeline: Timeline;
  message: string;
  privacyAccepted: boolean;
}
interface FormErrors {
  name?: string;
  email?: string;
  budget?: string;
  projectType?: string;
  timeline?: string;
  privacyAccepted?: string;
}

function BrandSelect({
  id,
  label,
  required = false,
  value,
  onChange,
  options,
  error,
  placeholder,
}: BrandSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <label htmlFor={id} className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase">
        {label} {required && <span className="text-primary">*</span>}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="border-accent/35 font-body text-text-primary hover:border-accent/55 focus:border-accent/60 focus:ring-accent/20 flex w-full items-center justify-between gap-4 rounded-2xl border bg-white/3 px-4 py-3 text-left text-sm transition outline-none focus:ring-2 sm:text-base"
      >
        <span className={selected ? "text-text-primary" : "text-text-primary/60"}>
          {selected?.label ?? placeholder}
        </span>

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101114] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          {options.map((opt) => {
            const active = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition sm:text-base ${active ? "bg-accent/10 text-text-primary" : "text-text-primary/80 hover:text-text-primary hover:bg-white/5"}`}
              >
                <span>{opt.label}</span>
                {active && <Check size={16} strokeWidth={2} className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <span className="text-sm text-red-300" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/* validation */
function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "El nombre es requerido.";
  if (!data.email.trim()) {
    errors.email = "El email es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresá un email válido.";
  }
  if (!data.projectType) errors.projectType = "Seleccioná un tipo de proyecto.";
  if (!data.timeline) errors.timeline = "Seleccioná un plazo estimado.";
  if (!data.privacyAccepted) errors.privacyAccepted = "Debés aceptar la política de privacidad.";

  return errors;
}

/* subcomponents */
interface SelectFieldProps {
  id: keyof Pick<FormData, "projectType" | "budget" | "timeline">;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

function SelectField({
  id,
  label,
  required,
  value,
  onChange,
  options,
  error,
  placeholder = "Seleccioná una opción.",
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${error ? "" : ""}`}>
      <label
        htmlFor={id}
        className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase"
      >
        {label}
        {required && <span className="text-magenta">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="font-body text-text-primary placeholder:text-text-primary/60 focus:border-cyan/50 focus:ring-cyan/20 w-full appearance-none rounded-2xl border border-white/10 bg-white/3 px-4 py-3 pr-11 text-sm transition outline-none sm:text-base"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value}
            </option>
          ))}
        </select>

        <span
          className="text-text-primary/60 pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
          aria-hidden="true"
        >
          <ChevronDown size={16} strokeWidth={1.7} />
        </span>
      </div>

      {error && (
        <span id={`${id}-error`} className="text-sm text-red-300" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/* Main component */
export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* handlers */
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const handleSelectChange =
    (name: keyof Pick<FormData, "projectType" | "budget" | "timeline">) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/3 p-6 md:p-8"
        role="status"
      >
        <CheckCircle2 size={20} strokeWidth={1.5} className="text-accent" />
        <span className="font-body text-text-primary/90 text-sm sm:text-base">
          Consulta enviada. Te respondo dentro de las próximas 48 horas hábiles.
        </span>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full min-w-0 rounded-[28px] border border-white/10 bg-white/3 p-6 md:p-8 flex flex-col gap-6 md:gap-8"
    >
      {/* nombre + email */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* nombre */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase"
          >
            Nombre <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="font-body text-text-primary placeholder:text-text-primary/60 focus:border-accent/50 focus:ring-accent/20 w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm transition outline-none focus:ring-2 sm:text-base"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />

          {errors.name && (
            <span id="name-error" className="text-sm text-red-300" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        {/* email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase"
          >
            Email <span className="text-primary">*</span>
          </label>

          <input
            type="email"
            id="email"
            name="email"
            className="font-body text-text-primary placeholder:text-text-primary/60 focus:border-accent/50 focus:ring-accent/20 w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm transition outline-none focus:ring-2 md:text-base"
            placeholder="tu@nombre.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />

          {errors.email && (
            <span id="email-error" className="text-sm text-red-300" role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Empresa / Proyecto */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="company"
          className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase"
        >
          Empresa / Poryecto <span className="text-text-primary/55 font-normal">(opcional)</span>
        </label>

        <input
          type="text"
          id="company"
          name="company"
          className="font-body text-text-primary placeholder:text-text-primary/60 focus:border-accent/50 focus:ring-accent/20 w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm transition outline-none focus:ring-2 md:text-base"
          placeholder="Nombre de la Empresa"
          value={formData.company}
          onChange={handleChange}
          autoComplete="organization"
        />
      </div>

      {/* Tipo de poryecto */}
      <BrandSelect
        id="projectType"
        label="Tipo de proyecto"
        required
        value={formData.projectType}
        onChange={handleSelectChange("projectType")}
        options={[
          { value: "Landing/Web Institucional", label: "Landing/Web Institucional" },
          { value: "E-Commerce", label: "E-Commerce" },
          { value: "Plataforma Web / App", label: "Plataforma Web / App" },
          { value: "Backend / API", label: "Backend / API" },
          { value: "Consultoría / Auditoría", label: "Consultoría / Auditoría" },
          { value: "Otro", label: "Otro" },
        ]}
        error={errors.projectType}
        placeholder="Seleccioná un tipo de proyecto"
      />

      {/* Prsupuesto + Plazo */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <BrandSelect
          id="budget"
          label="Presupuesto"
          value={formData.budget}
          onChange={handleSelectChange("budget")}
          options={[
            { value: "< $1.000", label: "< $1.000" },
            { value: "$1.000 - $3.000", label: "$1.000 - $3.000" },
            { value: "$3.000 - $7.000", label: "$3.000 - $7.000" },
            { value: "> $7.000", label: "> $7.000" },
          ]}
          placeholder="< $1.000"
        />
        <BrandSelect
          id="timeline"
          label="Plazo estimado"
          required
          value={formData.timeline}
          onChange={handleSelectChange("timeline")}
          options={[
            { value: "1-4 Semanas", label: "1-4 Semanas" },
            { value: "1-2 Meses", label: "1-2 Meses" },
            { value: "3+ Meses", label: "3+ Meses" },
            { value: "A definir", label: "A definir" },
          ]}
          error={errors.timeline}
          placeholder="1-4 Semanas"
        />
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="font-heading text-text-primary/75 text-[11px] sm:text-xs font-medium tracking-[0.12em] uppercase"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          className="font-body text-text-primary placeholder:text-text-primary/60 focus:border-accent/50 focus:ring-accent/20 min-h-35 w-full resize-y rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm transition outline-none focus:ring-2 md:text-base"
          placeholder="Contame el objetivo, lo principal que querés resolver y cualquier dato útil."
          value={formData.message}
          onChange={handleChange}
          rows={5}
        />
      </div>

      {/* checkbox */}
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
              className="font-body hover:decoration-accent underline decoration-white/35 underline-offset-2"
            >
              Pólitica de privacidad.
            </a>
          </span>
        </label>
        {errors.privacyAccepted && (
          <span id="privacy-error" className="text-sm text-red-300" role="alert">
            {errors.privacyAccepted}
          </span>
        )}
      </div>

      {/* submit */}
      <div className="pt-2">
        <Button
          fullWidth
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}

        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeOpacity={0.25}
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
              Enviando...
            </>
          ) : (
            "ENVIAR CONSULTA"
          )}
        </Button>
      </div>
    </form>
  );
}
