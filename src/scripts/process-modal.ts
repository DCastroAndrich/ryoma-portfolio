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
let lastFocusedElement: HTMLElement | null = null;

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

function setModalLayer(modal: HTMLElement, open: boolean) {
  modal.hidden = !open;
  modal.setAttribute("aria-hidden", open ? "false" : "true");
  modal.style.pointerEvents = open ? "auto" : "none";
  modal.style.display = open ? "" : "none";
}

function ensureProcessModal(): HTMLElement | null {
  const existing = document.getElementById("modal-process") as HTMLElement | null;
  if (existing) return existing;

  const template = document.querySelector<HTMLTemplateElement>(
    'template[data-process-template="modal-process"]',
  );
  if (!template) return null;

  const fragment = document.importNode(template.content, true);
  const modal = fragment.querySelector<HTMLElement>("#modal-process");
  if (!modal) return null;

  modal.dataset.injectedModal = "true";
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  modal.style.pointerEvents = "none";
  modal.style.display = "none";

  document.body.appendChild(fragment);

  return document.getElementById("modal-process") as HTMLElement | null;
}

function removeInjectedModalAfterClose(modal: HTMLElement) {
  if (modal.dataset.injectedModal !== "true") return;

  window.setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modal.remove();
    }
  }, 350);
}

function updateNav(modal: HTMLElement) {
  const prev = modal.querySelector<HTMLButtonElement>("#process-prev");
  const next = modal.querySelector<HTMLButtonElement>("#process-next");

  if (prev) prev.disabled = currentStep <= 0;
  if (next) next.disabled = currentStep >= processCases.length - 1;
}

function renderStep(index: number, modal: HTMLElement) {
  const data = processCases[index];
  if (!data) return;

  modal.setAttribute("data-direction", direction);
  modal.classList.add("is-switching");

  window.setTimeout(() => {
    const badgeEl = modal.querySelector<HTMLElement>("#process-step-badge");
    const titleEl = modal.querySelector<HTMLElement>("#process-step-title");
    const introEl = modal.querySelector<HTMLElement>("#process-step-intro");
    const problemEl = modal.querySelector<HTMLElement>("#process-step-problem");
    const decisionEl = modal.querySelector<HTMLElement>("#process-step-decision");
    const impactEl = modal.querySelector<HTMLElement>("#process-step-impact");
    const actionList = modal.querySelector<HTMLUListElement>("#process-step-actions");
    const currentEl = modal.querySelector<HTMLElement>("#process-current");
    const totalEl = modal.querySelector<HTMLElement>("#process-total");

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (introEl) introEl.textContent = data.intro;
    if (problemEl) problemEl.textContent = data.problem;
    if (decisionEl) decisionEl.textContent = data.decision;
    if (impactEl) impactEl.textContent = data.impact;

    if (actionList) {
      actionList.innerHTML = "";
      data.actions.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        actionList.appendChild(li);
      });
    }

    if (currentEl) currentEl.textContent = String(index + 1);
    if (totalEl) totalEl.textContent = String(processCases.length);

    updateNav(modal);
    modal.classList.remove("is-switching");
  }, 300);
}

function openProcessModal(index: number) {
  const modal = ensureProcessModal();
  if (!modal) return;

  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  currentStep = index;
  renderStep(currentStep, modal);
  updateNav(modal);

  modal.classList.add("is-open");
  setModalLayer(modal, true);
  lockScroll(true);

  const closeBtn = modal.querySelector<HTMLElement>("[data-modal-close]");
  closeBtn?.focus();
}

function closeProcessModal(modal: HTMLElement, restoreFocus = true) {
  modal.classList.remove("is-open");
  setModalLayer(modal, false);

  lockScroll(false);

  if (restoreFocus) {
    lastFocusedElement?.focus({ preventScroll: true });
  }

  removeInjectedModalAfterClose(modal);
}

export function initProcessModal() {
  if (initialized || typeof document === "undefined") return;
  initialized = true;

  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element)) return;

      const target = e.target;

      const openTrigger = target.closest<HTMLElement>("[data-process-open]");
      if (openTrigger) {
        e.preventDefault();

        const index = Number(openTrigger.dataset.processOpen);
        if (Number.isNaN(index)) return;

        openProcessModal(index);
        return;
      }

      const processModal = target.closest<HTMLElement>("#modal-process");
      if (!processModal) return;

      const closeTrigger = target.closest<HTMLElement>("[data-modal-close]");
      if (closeTrigger) {
        e.preventDefault();
        closeProcessModal(processModal);
        return;
      }

      const prevBtn = target.closest<HTMLElement>("#process-prev");
      if (prevBtn) {
        e.preventDefault();
        if (currentStep > 0) {
          currentStep -= 1;
          direction = "prev";
          renderStep(currentStep, processModal);
        }
        return;
      }

      const nextBtn = target.closest<HTMLElement>("#process-next");
      if (nextBtn) {
        e.preventDefault();
        if (currentStep < processCases.length - 1) {
          currentStep += 1;
          direction = "next";
          renderStep(currentStep, processModal);
        }
        return;
      }

      if (target === processModal) {
        closeProcessModal(processModal);
      }
    },
    true,
  );

  document.addEventListener("keydown", (e) => {
    const processModal = document.getElementById("modal-process") as HTMLElement | null;
    if (!processModal || !processModal.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeProcessModal(processModal);
      return;
    }

    if (e.key === "ArrowLeft" && currentStep > 0) {
      currentStep -= 1;
      direction = "prev";
      renderStep(currentStep, processModal);
    }

    if (e.key === "ArrowRight" && currentStep < processCases.length - 1) {
      currentStep += 1;
      direction = "next";
      renderStep(currentStep, processModal);
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
