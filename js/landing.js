/**
 * Single-screen landing — accessible dropdown menus
 */
(function () {
  "use strict";

  const groups = document.querySelectorAll("[data-dropdown]");
  const yearEl = document.getElementById("year");
  const footer = document.querySelector(".landing__footer");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function closeAll(except) {
    groups.forEach(function (group) {
      if (group === except) return;
      setOpen(group, false);
    });
  }

  function setOpen(group, open) {
    const trigger = group.querySelector(".cta__trigger");
    const menu = group.querySelector(".cta__menu");
    if (!trigger || !menu) return;

    group.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
  
    if (footer) {
      footer.style.display = open ? "none" : "";
    }
  }

  groups.forEach(function (group) {
    const trigger = group.querySelector(".cta__trigger");
    const menu = group.querySelector(".cta__menu");
    if (!trigger || !menu) return;

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = group.classList.contains("is-open");
      closeAll(group);
      setOpen(group, !isOpen);
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && !group.classList.contains("is-open")) {
        e.preventDefault();
        closeAll(group);
        setOpen(group, true);
        const first = menu.querySelector("a");
        if (first) first.focus();
      }
    });

    menu.addEventListener("keydown", function (e) {
      const items = Array.from(menu.querySelectorAll("a"));
      const idx = items.indexOf(document.activeElement);

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(group, false);
        trigger.focus();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = items[(idx + 1) % items.length];
        if (next) next.focus();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        if (prev) prev.focus();
      }

      if (e.key === "Tab" && !e.shiftKey && idx === items.length - 1) {
        setOpen(group, false);
      }
    });
  });

  document.addEventListener("click", function () {
    closeAll(null);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll(null);
  });
})();
