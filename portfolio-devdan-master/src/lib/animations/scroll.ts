import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export const setLenisInstance = (instance: Lenis | null) => {
  lenisInstance = instance;
};

export const getLenisInstance = () => lenisInstance;

export const scrollToId = (id: string, offset = -80) => {
  const target = id.startsWith("#") ? id : `#${id}`;
  const el = document.querySelector(target);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset });
  } else {
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};
