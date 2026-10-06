import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));

    if (reduceMotion) {
      sections.forEach((section) => section.classList.add("scroll-reveal-visible"));
      return;
    }

    sections.forEach((section, index) => {
      section.classList.add("scroll-reveal");
      section.dataset.revealDirection = index % 2 === 0 ? "up" : "left";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
