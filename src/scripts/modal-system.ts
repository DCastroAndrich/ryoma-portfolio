let initialized = false;

const MODAL_Z_INDEX = 1000;
const LIGHTBOX_Z_INDEX = 2000;

type LightboxItem = {
  src: string;
  alt: string;
};

let lastFocusedElement: HTMLElement | null = null;

function getOpenModals(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(".modal-overlay.is-open"));
}

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

function bringToFront(el: HTMLElement, zIndex: number) {
  el.style.zIndex = String(zIndex);
}

function setModalLayer(modal: HTMLElement, open: boolean) {
  modal.hidden = !open;
  modal.setAttribute("aria-hidden", open ? "false" : "true");
  modal.style.pointerEvents = open ? "auto" : "none";
  modal.style.zIndex = open ? String(MODAL_Z_INDEX) : "";
  modal.style.display = open ? "" : "none";
}

function setLightboxLayer(open: boolean) {
  const lightbox = document.getElementById("modal-lightbox") as HTMLElement | null;
  if (!lightbox) return;

  lightbox.hidden = !open;
  lightbox.setAttribute("aria-hidden", open ? "false" : "true");
  lightbox.style.pointerEvents = open ? "auto" : "none";
  lightbox.style.zIndex = open ? String(LIGHTBOX_Z_INDEX) : "";
  lightbox.style.display = open ? "" : "none";

  if (!open) {
    const lightboxImg = document.getElementById("lightbox-img");
    if (lightboxImg instanceof HTMLImageElement) {
      lightboxImg.src = "";
      lightboxImg.alt = "";
    }

    lightbox.classList.remove("is-open");
    document.documentElement.classList.remove("lightbox-open");
  }
}

function ensureModalFromTemplate(id: string): HTMLElement | null {
  const existing = document.getElementById(id) as HTMLElement | null;
  if (existing) return existing;

  const template = document.querySelector<HTMLTemplateElement>(
    `template[data-modal-template="${id}"]`,
  );
  if (!template) return null;

  const fragment = document.importNode(template.content, true);
  const modal = fragment.querySelector<HTMLElement>(`#${id}`);
  if (!modal) return null;

  modal.dataset.injectedModal = "true";
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  modal.style.pointerEvents = "none";
  modal.style.zIndex = "";
  modal.style.display = "none";

  document.body.appendChild(fragment);

  return document.getElementById(id) as HTMLElement | null;
}

function openModal(modal: HTMLElement) {
  lastFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  setModalLayer(modal, true);
  modal.classList.add("is-open");
  lockScroll(true);

  const closeBtn = modal.querySelector<HTMLElement>("[data-modal-close]");
  closeBtn?.focus();
}

function removeInjectedModalAfterClose(modal: HTMLElement) {
  if (modal.dataset.injectedModal !== "true") return;

  window.setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modal.remove();
    }
  }, 350);
}

function closeModal(modal: HTMLElement, options: { restoreFocus?: boolean } = {}) {
  const { restoreFocus = true } = options;

  modal.classList.remove("is-open");
  setModalLayer(modal, false);

  if (modal.id === "modal-lightbox") {
    setLightboxLayer(false);
  }

  const remainingOpen = getOpenModals().filter((el) => el !== modal);

  if (remainingOpen.length === 0) {
    lockScroll(false);

    if (restoreFocus) {
      lastFocusedElement?.focus({ preventScroll: true });
    }
  }

  removeInjectedModalAfterClose(modal);
}

export function initModalSystem() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const lightbox = document.getElementById("modal-lightbox") as HTMLElement | null;
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPrevBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-prev]");
  const lightboxNextBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-next]");
  const lightboxCounter = document.getElementById("lightbox-counter");

  setLightboxLayer(false);

  let images: LightboxItem[] = [];
  let currentIndex = 0;

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

    document
      .querySelectorAll<HTMLElement>(".modal-overlay.is-open:not(#modal-lightbox)")
      .forEach((modal) => {
        bringToFront(modal, MODAL_Z_INDEX);
      });

    setLightboxLayer(true);
    lightbox.classList.add("is-open");
    document.documentElement.classList.add("lightbox-open");
    lockScroll(true);
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

        const modal = ensureModalFromTemplate(id);
        if (modal instanceof HTMLElement) {
          openModal(modal);
        }

        return;
      }

      const closeTrigger = target.closest<HTMLElement>("[data-modal-close]");
      if (closeTrigger) {
        e.preventDefault();

        const modal = closeTrigger.closest<HTMLElement>(".modal-overlay");
        if (!modal) return;

        const targetId =
          closeTrigger.dataset.scrollTarget ||
          (closeTrigger.getAttribute("href")?.startsWith("#")
            ? closeTrigger.getAttribute("href")!.slice(1)
            : null);

        closeModal(modal, { restoreFocus: !targetId });

        if (targetId) {
          history.pushState(null, "", `#${targetId}`);
          window.requestAnimationFrame(() => {
            const targetEl = document.getElementById(targetId);
            targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }

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
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModalSystem, { once: true });
  } else {
    initModalSystem();
  }
}
