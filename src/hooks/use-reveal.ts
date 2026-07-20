import { useEffect } from "react";

/**
 * Adds `is-visible` to any element with `[data-reveal]` when it enters the viewport.
 * Attach once at the layout level.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observed = new WeakSet<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    const observeRevealElement = (el: HTMLElement) => {
      if (el.classList.contains("is-visible") || observed.has(el)) return;
      observed.add(el);
      io.observe(el);
    };

    const observeRevealTree = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) {
        observeRevealElement(root);
      }

      root
        .querySelectorAll?.<HTMLElement>("[data-reveal]")
        .forEach((el) => observeRevealElement(el));
    };

    observeRevealTree(document);

    const mutationObserver =
      "MutationObserver" in window
        ? new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                  observeRevealTree(node);
                }
              });
            }
          })
        : null;

    mutationObserver?.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver?.disconnect();
      io.disconnect();
    };
  }, []);
}
