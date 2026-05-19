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
    problem: "El cleinte tenía ventas fragmentadas entre canales sin flujo claro.",
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

const modal = document.getElementById("modal-process");

function renderStep(index: number) {
  const data = processCases[index];

  if (!data || !modal) return;

  modal?.setAttribute("data-direction", direction);
  modal?.classList.add("is-switching");

  setTimeout(() => {
    (document.getElementById("process-step-badge") as HTMLElement).textContent = data.badge;
    (document.getElementById("process-step-title") as HTMLElement).textContent = data.title;
    (document.getElementById("process-step-intro") as HTMLElement).textContent = data.intro;
    (document.getElementById("process-step-problem") as HTMLElement).textContent = data.problem;
    (document.getElementById("process-step-decision") as HTMLElement).textContent = data.decision;
    (document.getElementById("process-step-impact") as HTMLElement).textContent = data.impact;

    const actionList = document.getElementById("process-step-actions") as HTMLUListElement | null;

    if (!actionList) return;

    actionList.innerHTML = "";

    (data.actions as string[]).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      actionList.appendChild(li);
    });
    (document.getElementById("process-current") as HTMLElement).textContent = String(index + 1);
    (document.getElementById("process-total") as HTMLElement).textContent = String(
      processCases.length,
    );

    updateNav();

    modal?.classList.remove("is-switching");
  }, 300);
}

function updateNav() {
  const prev = document.getElementById("process-prev") as HTMLButtonElement;
  const next = document.getElementById("process-next") as HTMLButtonElement;

  prev.disabled = currentStep === 0;
  next.disabled = currentStep === processCases.length - 1;
}

export function initProcessModal() {
  document.querySelectorAll("[data-process-open]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      const index = Number((el as HTMLElement).dataset.processOpen);
      if (index === currentStep && currentStep !== -1) return;
      currentStep = index;

      renderStep(currentStep);
      updateNav();

      const modal = document.getElementById("modal-process");
      modal?.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
    });
  });

  document.getElementById("process-prev")?.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      direction = "prev";
      renderStep(currentStep);
    }
  });

  document.getElementById("process-next")?.addEventListener("click", () => {
    if (currentStep < processCases.length - 1) {
      currentStep++;
      direction = "next";
      renderStep(currentStep);
    }
  });

  document.addEventListener("process:reset", () => {
    currentStep = -1;
  });
}
