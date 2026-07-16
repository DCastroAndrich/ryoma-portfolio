import type { LightboxItem, LightboxGallery, LightboxElements } from "./modal-types";

export class LightboxController {
  private elements: LightboxElements;

  private images: LightboxItem[] = [];

  private currentIndex = 0;

  constructor() {
    const root = document.getElementById("modal-lightbox");

    const image = document.getElementById("lightbox-img") as HTMLImageElement | null;

    if (!root || !image) {
      throw new Error("Lightbox elements not found");
    }

    this.elements = {
      root,
      image,
      counter: document.getElementById("lightbox-counter"),
      prevButton: document.querySelector("[data-lightbox-prev]"),
      nextButton: document.querySelector("[data-lightbox-next]"),
    };
  }

  public setGallery(gallery: LightboxGallery): void {
    this.images = gallery.images;
    this.currentIndex = gallery.index;
  }

  public getGallery(): LightboxGallery {
    return {
      images: this.images,
      index: this.currentIndex,
    };
  }

  public getImages(): LightboxItem[] {
    return this.images;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getCurrentItem(): LightboxItem | null {
    return this.images[this.currentIndex] ?? null;
  }

  public setCurrentIndex(index: number): void {
    this.currentIndex = index;
  }

  public open(): void {}

  public close(): void {}

  public next(): void {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  public previous(): void {
    if (this.images.length <= 1) return;

    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  private render(): void {}

  private renderImage(): void {}

  private updateNavigation(): void {}

  private updateCounter(): void {}

  private preloadNeighbours(): void {}

  private buildGallery(): LightboxGallery {
    return {
      images: [],
      index: 0,
    };
  }
}
