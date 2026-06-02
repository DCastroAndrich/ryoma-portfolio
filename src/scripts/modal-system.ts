let initialized = false;

type LightboxItem = {
  src: string;
  alt: string;
};

function getOpenModal(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".modal-overlay.is-open");
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
  document.documentElement.classList.remove("lightbox-open");

  const lightboxImg = document.getElementById("lightbox-img");
  if (lightboxImg instanceof HTMLImageElement) {
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  lockScroll(false);
}

export function initModalSystem() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const lightbox = document.getElementById("modal-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxPrevBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-prev]");
  const lightboxNextBtn = document.querySelector<HTMLButtonElement>("[data-lightbox-next]");
  const lightboxCounter = document.getElementById("lightbox-counter");

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
    if (!(lightbox instanceof HTMLElement)) return;

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

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;

    const openTrigger = e.target.closest<HTMLElement>("[data-modal-open]");
    if (openTrigger) {
      e.preventDefault();
      const id = openTrigger.dataset.modalOpen;
      if (!id) return;

      const modal = document.getElementById(id);
      if (modal instanceof HTMLElement) openModal(modal);
      return;
    }

    const closeTrigger = e.target.closest<HTMLElement>("[data-modal-close]");
    if (closeTrigger) {
      e.preventDefault();

      const modal = closeTrigger.closest<HTMLElement>(".modal-overlay");
      if (modal) closeModal(modal);
      return;
    }

    const lightboxTrigger = e.target.closest<HTMLElement>("[data-lightbox-src]");
    if (lightboxTrigger) {
      e.preventDefault();
      openLightboxFromTrigger(lightboxTrigger);
      return;
    }

    const openOverlay = e.target.closest<HTMLElement>(".modal-overlay.is-open");
    if (openOverlay && e.target === openOverlay) {
      closeModal(openOverlay);
    }
  });

  document.addEventListener("keydown", (e) => {
    const open = getOpenModal();
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
