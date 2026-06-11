let initialized = false;

type LightboxItem = {
  src: string;
  alt: string;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  deliverable: string;
};

function getOpenModals(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".modal-overlay.is-open"));
}

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

function openModal(modal: HTMLElement) {
  modal.classList.add("is-open");
  lockScroll(true);

  const closeBtn = modal.querySelector<HTMLElement>("[data-modal-close]");
  closeBtn?.focus();
}

function closeModal(modal: HTMLElement) {
  modal.classList.remove("is-open");

  const lightboxImg = document.getElementById("lightbox-img");
  if (lightboxImg instanceof HTMLImageElement) {
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  const remainingOpen = getOpenModals().filter((el) => el !== modal);
  if (remainingOpen.length === 0) {
    document.documentElement.classList.remove("lightbox-open");
    lockScroll(false);
  }
}

function parseStep(value: string | undefined): ProcessStep | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as ProcessStep;
  } catch {
    return null;
  }
}

export function initModalSystem() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const lightbox = document.getElementById("modal-lightbox") as HTMLElement | null;
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPrevBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-prev]");
  const lightboxNextBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-next]");
  const lightboxCounter = document.getElementById("lightbox-counter");

  const processModal = document.getElementById("modal-process") as HTMLElement | null;
  const processNumber = processModal?.querySelector<HTMLElement>("[data-process-number]") ?? null;
  const processTitle = processModal?.querySelector<HTMLElement>("[data-process-title]") ?? null;
  const processDescription =
    processModal?.querySelector<HTMLElement>("[data-process-description]") ?? null;
  const processBullets =
    processModal?.querySelector<HTMLUListElement>("[data-process-bullets]") ?? null;
  const processDeliverable =
    processModal?.querySelector<HTMLElement>("[data-process-deliverable]") ?? null;
  const processPrevBtn =
    processModal?.querySelector<HTMLButtonElement>("[data-process-prev]") ?? null;
  const processNextBtn =
    processModal?.querySelector<HTMLButtonElement>("[data-process-next]") ?? null;

  let images: LightboxItem[] = [];
  let currentIndex = 0;

  let processTriggers: HTMLElement[] = [];
  let currentProcessIndex = 0;

  function updateLightbox() {
    if (!(lightboxImg instanceof HTMLImageElement)) return;

    const current = images[currentIndex];
    if (!current) return;

    lightboxImg.src = current.src;
    lightboxImg.alt = current.alt || "";

    const showNav = images.length > 1;

    if (lightboxPrevBtn) lightboxPrevBtn.hidden = !showNav;
    if (lightboxNextBtn) lightboxNextBtn.hidden = !showNav;

    if (lightboxCounter) {
      lightboxCounter.textContent = showNav ? `${currentIndex + 1} / ${images.length}` : "";
      lightboxCounter.style.display = showNav ? "block" : "none";
    }
  }

  function openLightboxFromTrigger(trigger: HTMLElement) {
    if (!lightbox) return;

    const src = trigger.dataset.lightboxSrc;
    const alt = trigger.dataset.lightboxAlt || "";
    const group = trigger.dataset.lightboxGroup;

    if (!src) return;

    if (group) {
      const groupItems = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-lightbox-group="${group}"]`),
      );

      images = groupItems
        .map((el) => ({
          src: el.dataset.lightboxSrc || "",
          alt: el.dataset.lightboxAlt || "",
        }))
        .filter((item) => item.src);

      currentIndex = Math.max(
        0,
        images.findIndex((item) => item.src === src),
      );
    } else {
      images = [{ src, alt }];
      currentIndex = 0;
    }

    updateLightbox();
    lightbox.classList.add("is-open");
    document.documentElement.classList.add("lightbox-open");
    lockScroll(true);
  }

  function renderProcessStep(step: ProcessStep) {
    if (processNumber) processNumber.textContent = step.number;
    if (processTitle) processTitle.textContent = step.title;
    if (processDescription) processDescription.textContent = step.description;
    if (processDeliverable) processDeliverable.textContent = step.deliverable;

    if (processBullets) {
      processBullets.innerHTML = "";
      step.bullets.forEach((bullet) => {
        const li = document.createElement("li");
        li.textContent = bullet;
        processBullets.appendChild(li);
      });
    }

    if (processPrevBtn) processPrevBtn.disabled = processTriggers.length <= 1;
    if (processNextBtn) processNextBtn.disabled = processTriggers.length <= 1;
  }

  function openProcessFromTrigger(trigger: HTMLElement) {
    if (!processModal) return;

    processTriggers = Array.from(document.querySelectorAll<HTMLElement>("[data-process-open]"));

    const step = parseStep(trigger.dataset.processStep);
    if (!step) return;

    currentProcessIndex = Math.max(0, processTriggers.indexOf(trigger));
    renderProcessStep(step);
    openModal(processModal);
  }

  function openProcessStepAt(index: number) {
    if (!processModal || processTriggers.length === 0) return;

    currentProcessIndex = (index + processTriggers.length) % processTriggers.length;

    const trigger = processTriggers[currentProcessIndex];
    const step = parseStep(trigger.dataset.processStep);
    if (!step) return;

    renderProcessStep(step);
  }

  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element)) return;

      const target = e.target;

      const openTrigger = target.closest<HTMLElement>("[data-modal-open]");
      if (openTrigger) {
        e.preventDefault();
        const id = openTrigger.dataset.modalOpen;
        if (!id) return;

        const modal = document.getElementById(id);
        if (modal instanceof HTMLElement) openModal(modal);
        return;
      }

      const processTrigger = target.closest<HTMLElement>("[data-process-open]");
      if (processTrigger) {
        e.preventDefault();
        openProcessFromTrigger(processTrigger);
        return;
      }

      const closeTrigger = target.closest<HTMLElement>("[data-modal-close]");
      if (closeTrigger) {
        e.preventDefault();

        const modal = closeTrigger.closest<HTMLElement>(".modal-overlay");
        if (modal) closeModal(modal);
        return;
      }

      const lightboxTrigger = target.closest<HTMLElement>("[data-lightbox-src]");
      if (lightboxTrigger) {
        e.preventDefault();
        openLightboxFromTrigger(lightboxTrigger);
        return;
      }

      if (lightbox && target === lightbox && lightbox.classList.contains("is-open")) {
        closeModal(lightbox);
      }
    },
    true,
  );

  document.addEventListener("keydown", (e) => {
    const open = getOpenModals().at(-1);
    if (!open) return;

    if (e.key === "Escape") {
      closeModal(open);
      return;
    }

    if (processModal?.classList.contains("is-open")) {
      if (e.key === "ArrowLeft") openProcessStepAt(currentProcessIndex - 1);
      if (e.key === "ArrowRight") openProcessStepAt(currentProcessIndex + 1);
      return;
    }

    if (!lightbox?.classList.contains("is-open") || images.length <= 1) return;

    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }

    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }
  });

  lightboxPrevBtn?.addEventListener("click", () => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  });

  lightboxNextBtn?.addEventListener("click", () => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  });

  processPrevBtn?.addEventListener("click", () => {
    openProcessStepAt(currentProcessIndex - 1);
  });

  processNextBtn?.addEventListener("click", () => {
    openProcessStepAt(currentProcessIndex + 1);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModalSystem, { once: true });
  } else {
    initModalSystem();
  }
}
