export interface LightboxItem {
  src: string;
  alt: string;
  type?: "image";
}

export interface LightboxGallery {
  images: LightboxItem[];
  index: number;
}

export interface LightboxElements {
  root: HTMLElement;
  image: HTMLImageElement;
  counter: HTMLElement | null;
  prevButton: HTMLButtonElement | null;
  nextButton: HTMLButtonElement | null;
}
