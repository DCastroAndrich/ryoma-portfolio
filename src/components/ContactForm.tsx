import { useState, type FormEvent, type ChangeEvent } from "react"
import { ChevronDown, CheckCircle2 } from "lucide-react"

/* Types */

type ProjectType = "" | "Landing/Web Institucional" | "E-Commerce" | "Plataforma Web / App" | "Backend / API" | "Consultoría / Auditoría" | "Otro";
type Budget = "" | "< $1.000" | "$1.000 - $3.000" | "$3.000 - $7.000" | "> $7.000";
type Timeline = "" | "1-4 Semanas" | "1-2 Meses" | "3+ Meses" | "A definir";

interface FormData {
    name: string;
    email: string;
    company: string;
    projectType: ProjectType;
    budget: Budget;
    timeline: Timeline
    message: string;
    privacyAccepted: boolean
}
interface FormErrors {
    name?: string;
    email?: string;
    projectType?: string;
    timeline?: string,
    privacyAccepted?: string
}

/* validation */
function validate(data: FormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.name.trim()) errors.name = "El nombre es requerido."
    if (!data.email.trim()) {
        errors.email = "El email es requerido."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Ingresá un email válido."
    }
    if (!data.projectType) errors.projectType = "Seleccioná un tipo de proyecto."
    if (!data.timeline) errors.timeline = "Seleccioná un plazo estimado."
    if (!data.privacyAccepted) errors.privacyAccepted = "Debés aceptar la política de privacidad."

    return errors;
}

/* subcomponents */
interface SelectFieldProps {
    id: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    error?: string;
    placeholder?: string
}

function SelectField({
    id, label, required, value, onChange, options, error, placeholder = "Seleccioná una opción."
}: SelectFieldProps) {
    return (
        <div className={`contact-field${error ? " has-error" : ""}`}>
            <label htmlFor={id} className="contact-label">
                {label}
                {required && <span className="contact-required">*</span>}
            </label>
            <div className="contact-select-wrapper">
                <select
                    id={id}
                    name={id}
                    className="contact-select"
                    value={value}
                    onChange={onChange}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                >
                    <option value={""} disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} >
                            {opt.value}
                        </option>
                    ))}
                </select>
                <span className="contact-select-icon" aria-hidden="true">
                    <ChevronDown size={16} strokeWidth={1.5} />
                </span>
            </div>
            {error && (
                <span id={`${id}-error`} className="contact-error-msg" role="alert" >
                    {error}
                </span>
            )}
        </div>
    )
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
        privacyAccepted: false
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    /* handlers */
    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

        setFormData((prev) => ({
            ...prev, [name]: type === "checkbox" ? checked : value
        }))

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const newErrors = validate(formData)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)

        await new Promise((resolve) => setTimeout(resolve, 1200))
        setIsSubmitting(false)
        setSubmitted(true)
    }
    if (submitted) {
        return (
            <div className="contact-success-msg" role="status">
                <CheckCircle2 size={20} strokeWidth={1.5} />
                <span>
                    Consulta enviada. Te respondo dentro de las próximas 48 horas hábiles.
                </span>
            </div>
        )
    }
    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {/* nombre + email */}
            <div className="contact-form-row">
                {/* nombre */}
                <div className={`contact-field${errors.name ? " has-error" : ""}`} >
                    <label htmlFor="name" className="contact-label">
                        Nombre <span className="contact-required">*</span>
                    </label>
                    <div className="contact-input-wrapper">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="contact-input"
                            placeholder="Juan Pérez"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="anme"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                        />
                    </div>
                    {errors.name && (
                        <span id="name-error" className="contact-error-msg" role="alert">
                            {errors.name}
                        </span>
                    )}
                </div>
                {/* email */}
                <div className={`contact-field${errors.email ? " has-error" : ""}`}>
                    <label htmlFor="email" className="contact-label">
                        Email <span className="contact-required">*</span>
                    </label>
                    <div className="contact-input-wrapper">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="contact-input"
                            placeholder="tu@nombre.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                        />
                    </div>
                    {errors.email && (
                        <span id="email-error" className="contact-error-msg" role="alert">
                            {errors.email}
                        </span>
                    )}
                </div>
            </div>

            {/* Empresa / Proyecto */}
            <div className="contact-field">
                <label htmlFor="company" className="contact-label">
                    Empresa / Poryecto{" "}
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 300 }}>(opcional)</span>
                </label>
                <div className="contact-input-wrapper">
                    <input
                        type="text"
                        id="company"
                        name="company"
                        className="contact-input"
                        placeholder="Nombre de la Empresa"
                        value={formData.company}
                        onChange={handleChange}
                        autoComplete="organization"
                    />
                </div>
            </div>

            {/* Tipo de poryecto */}
            <SelectField
                id="projectType"
                label="Tipo de proyecto"
                required
                value={formData.projectType}
                onChange={handleChange as (e: ChangeEvent<HTMLSelectElement>) => void}
                options={[
                    { value: "Landing/Web Institucional", label: "Landing/Web Institucional" },
                    { value: "E-Commerce", label: "E-Commerce" },
                    { value: "Plataforma Web / App", label: "Plataforma Web / App" },
                    { value: "Backend / API", label: "Backend / API" },
                    { value: "Consultoría / Auditoría", label: "Consultoría / Auditoría" },
                    { value: "Otro", label: "Otro" },
                ]}
                error={errors.projectType}
                placeholder="Landing/Web Institucional"
            />

            {/* Prsupuesto + Plazo */}
            <div className="contact-form-row">
                <SelectField
                    id="budget"
                    label="Presupuesto"
                    value={formData.budget}
                    onChange={handleChange as (e: ChangeEvent<HTMLSelectElement>) => void}
                    options={[
                        { value: "< $1.000", label: "< $1.000" },
                        { value: "$1.000 - $3.000", label: "$1.000 - $3.000" },
                        { value: "$3.000 - $7.000", label: "$3.000 - $7.000" },
                        { value: "> $7.000", label: "> $7.000" },
                    ]}
                    placeholder="< $1.000"
                />
                <SelectField
                    id="timeline"
                    label="Plazo estimado"
                    required
                    value={formData.timeline}
                    onChange={handleChange as (e: ChangeEvent<HTMLSelectElement>) => void}
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
            <div className="contact-field">
                <label htmlFor="message" className="contact-label">
                    Mensaje
                </label>
                <div className="contact-textarea-wrapper">
                    <textarea
                        id="message"
                        name="message"
                        className="contact-textarea"
                        placeholder="Contame el objetivo, lo principal que querés resolver y cualquier dato útil."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                    />
                </div>
            </div>

            {/* checkbox */}
            <div className={`contact-field${errors.privacyAccepted ? " has-error" : ""}`} >
                <label className="contact-checkbox-wrapper">
                    <input
                        type="checkbox"
                        name="privacyAccepted"
                        className="contact-checkbox"
                        checked={formData.privacyAccepted}
                        onChange={handleChange}
                        aria-invalid={!!errors.privacyAccepted}
                        aria-describedby={errors.privacyAccepted ? "privacy-error" : undefined}
                    />
                    <span className="contact-checkbox-label">
                        Acepto que mis datos sean usados para contactarme según la <a href="/privacy" target="_blank" className="underline underline-offset-2 decoration-1 hover:decoration-accent">Pólitica de privacidad.</a>
                    </span>
                </label>
                {errors.privacyAccepted && (
                    <span id="privacy-error" className="contact-error-msg" role="alert" style={{ marginLeft: "1.625rem" }} >
                        {errors.privacyAccepted}
                    </span>
                )}
            </div>

            {/* submit */}
            <div className="contact-submit-area">
                <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting} aria-busy={isSubmitting} style={{ alignSelf: "flex-start" }} >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                            Enviando
                        </>
                    ) : (
                        "ENVIAR CONSULTA"
                    )}
                </button>
            </div>
        </form>
    )
}