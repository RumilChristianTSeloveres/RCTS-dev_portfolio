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

  const username = "RumilChristianTSeloveres";
  const yearSelect = document.getElementById("github-year");
  const calendar = document.getElementById("github-calendar");
  const monthLabels = document.getElementById("github-months");
  const total = document.getElementById("github-contribution-total");
  const activityLink = document.getElementById("github-activity-link");

  if (yearSelect && calendar && total) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2022; year -= 1) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      yearSelect.appendChild(option);
    }

    async function loadContributions(year) {
      total.textContent = `Loading ${year} contributions…`;
      calendar.replaceChildren();
      if (monthLabels) monthLabels.replaceChildren();
      if (activityLink) {
        activityLink.href = `https://github.com/${username}?tab=overview&from=${year}-01-01&to=${year}-12-31`;
      }

      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`);
        if (!response.ok) throw new Error("Contribution request failed");
        const data = await response.json();
        const days = data.contributions || [];

        if (days.length) {
          const leadingDays = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
          for (let index = 0; index < leadingDays; index += 1) {
            const empty = document.createElement("span");
            empty.className = "github-calendar__day github-calendar__day--empty";
            calendar.appendChild(empty);
          }
        }

        days.forEach(function (day) {
          const cell = document.createElement("span");
          cell.className = "github-calendar__day";
          cell.dataset.level = String(day.level);
          cell.title = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`;
          calendar.appendChild(cell);
        });

        if (monthLabels && days.length) {
          const leadingDays = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
          days.forEach(function (day, index) {
            const date = new Date(`${day.date}T00:00:00Z`);
            if (date.getUTCDate() === 1) {
              const label = document.createElement("span");
              label.textContent = date.toLocaleString("en", { month: "short", timeZone: "UTC" });
              label.style.gridColumn = String(Math.floor((leadingDays + index) / 7) + 1);
              monthLabels.appendChild(label);
            }
          });
        }

        const count = data.total && data.total[String(year)] !== undefined ? data.total[String(year)] : 0;
        total.textContent = `${count} contribution${count === 1 ? "" : "s"} in ${year}`;
        calendar.setAttribute("aria-label", `${count} GitHub contributions by ${username} in ${year}`);
      } catch (error) {
        total.textContent = "Contribution data is temporarily unavailable.";
        calendar.setAttribute("aria-label", "GitHub contribution data unavailable");
      }
    }

    yearSelect.addEventListener("change", function () {
      loadContributions(yearSelect.value);
    });

    loadContributions(String(currentYear));
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
