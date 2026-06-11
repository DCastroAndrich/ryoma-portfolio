type ProcessCase = {
  badge: string;
  title: string;
  intro: string;
  problem: string;
  actions: string[];
  decision: string;
  impact: string;
};

const processCases: ProcessCase[] = [
  {
    badge: "Paso 01",
    title: "Descubrimiento",
    intro: "Entender el problema real antes de diseñar cualquier solución.",
    problem: "El cliente tenía ventas fragmentadas entre canales sin flujo claro.",
    actions: [
      "Entrevistas con stakeholders",
      "Análisis de flujo actual",
      "Detección de fricción en la conversión",
    ],
    decision: "Priorizar claridad de catálogo sobre features complejas.",
    impact: "Base sólida para construir sin rehacer decisiones.",
  },
  {
    badge: "Paso 02",
    title: "Diseño & Prototipo",
    intro: "Validar la experiencia antes de escribir código.",
    problem: "El usuario no entendía el producto rápidamente.",
    actions: [
      "Diseño de flujo simplificado",
      "Prototipo navegable",
      "Iteración rápida con feedback",
    ],
    decision: "Reducir pasos y eliminar distracciones.",
    impact: "Experiencia clara desde el primer contacto.",
  },
  {
    badge: "Paso 03",
    title: "Desarrollo & Deploy",
    intro: "Convertir el diseño en una herramienta real.",
    problem: "Necesidad de performance y escalabilidad.",
    actions: ["Arquitectura modular", "Componentes reutilizables", "Deploy controlado"],
    decision: "Priorizar performance sobre complejidad innecesaria.",
    impact: "Sitio rápido, estable y preparado para crecer.",
  },
  {
    badge: "Paso 04",
    title: "Mantenimiento & Escalado",
    intro: "Acompañar el crecimiento del producto.",
    problem: "Los productos digitales quedan obsoletos sin evolución.",
    actions: ["Documentación del sistema", "Monitoreo de performance", "Plan de mejoras"],
    decision: "Evolución continua en lugar de rediseños completos.",
    impact: "Sistema que crece sin romperse.",
  },
];

let currentStep = -1;
let direction: "next" | "prev" = "next";
let initialized = false;

function getModal(): HTMLElement | null {
  return document.getElementById("modal-process") as HTMLElement | null;
}

function setText(modal: HTMLElement, selector: string, value: string) {
  const el = modal.querySelector<HTMLElement>(selector);
  if (el) el.textContent = value;
}

function updateNav(modal: HTMLElement) {
  const prev = modal.querySelector<HTMLButtonElement>("#process-prev");
  const next = modal.querySelector<HTMLButtonElement>("#process-next");

  if (prev) prev.disabled = currentStep <= 0;
  if (next) next.disabled = currentStep >= processCases.length - 1;
}

function renderStep(index: number) {
  const modal = getModal();
  const data = processCases[index];
  if (!modal || !data) return;

  modal.setAttribute("data-direction", direction);
  modal.classList.add("is-switching");

  window.setTimeout(() => {
    setText(modal, "#process-step-badge", data.badge);
    setText(modal, "#process-step-title", data.title);
    setText(modal, "#process-step-intro", data.intro);
    setText(modal, "#process-step-problem", data.problem);
    setText(modal, "#process-step-decision", data.decision);
    setText(modal, "#process-step-impact", data.impact);

    const actionList = modal.querySelector<HTMLUListElement>("#process-step-actions");
    if (actionList) {
      actionList.innerHTML = "";
      data.actions.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        actionList.appendChild(li);
      });
    }

    const currentEl = modal.querySelector<HTMLElement>("#process-current");
    if (currentEl) currentEl.textContent = String(index + 1);

    const totalEl = modal.querySelector<HTMLElement>("#process-total");
    if (totalEl) totalEl.textContent = String(processCases.length);

    updateNav(modal);
    modal.classList.remove("is-switching");
  }, 300);
}

function openProcess(index: number) {
  const modal = getModal();
  if (!modal) return;

  currentStep = index;
  renderStep(currentStep);

  modal.classList.add("is-open");
  document.documentElement.style.overflow = "hidden";
  updateNav(modal);
}

export function initProcessModal() {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element)) return;

      const trigger = e.target.closest<HTMLElement>("[data-process-open]");
      if (!trigger) return;

      const index = Number(trigger.dataset.processOpen);
      if (Number.isNaN(index)) return;

      e.preventDefault();
      openProcess(index);
    },
    true,
  );

  document.addEventListener("keydown", (e) => {
    const modal = getModal();
    if (!modal || !modal.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      modal.classList.remove("is-open");
      document.documentElement.style.overflow = "";
      return;
    }

    if (e.key === "ArrowLeft" && currentStep > 0) {
      currentStep -= 1;
      direction = "prev";
      renderStep(currentStep);
    }

    if (e.key === "ArrowRight" && currentStep < processCases.length - 1) {
      currentStep += 1;
      direction = "next";
      renderStep(currentStep);
    }
  });

  const modal = getModal();
  if (!modal) return;

  modal.querySelector("#process-prev")?.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep -= 1;
      direction = "prev";
      renderStep(currentStep);
    }
  });

  modal.querySelector("#process-next")?.addEventListener("click", () => {
    if (currentStep < processCases.length - 1) {
      currentStep += 1;
      direction = "next";
      renderStep(currentStep);
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProcessModal, { once: true });
  } else {
    initProcessModal();
  }
}
