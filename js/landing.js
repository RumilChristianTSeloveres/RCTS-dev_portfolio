/**
 * Single-screen landing — accessible dropdown menus
 */
(function () {
  "use strict";

  const yearEl = document.getElementById("year");
  const scrollDown = document.getElementById("scroll-down");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const professionalActivityDialog = document.getElementById("professional-activity-dialog");
  const professionalActivityDialogOpen = document.querySelector("[data-professional-activity-dialog-open]");

  if (professionalActivityDialog && professionalActivityDialogOpen) {
    professionalActivityDialogOpen.addEventListener("click", function () {
      if (typeof professionalActivityDialog.showModal === "function") {
        professionalActivityDialog.showModal();
        document.body.classList.add("is-dialog-open");
      }
    });

    professionalActivityDialog.addEventListener("close", function () {
      document.body.classList.remove("is-dialog-open");
    });

    professionalActivityDialog.addEventListener("click", function (event) {
      if (event.target === professionalActivityDialog) {
        professionalActivityDialog.close();
      }
    });
  }

  function setupContributionCalendar(container) {
    const username = container.dataset.githubAccount;
    const yearSelect = container.querySelector("[data-github-year]");
    const calendar = container.querySelector("[data-github-calendar]");
    const monthLabels = container.querySelector("[data-github-months]");
    const total = container.querySelector("[data-github-total]");
    const activityLink = container.querySelector("[data-github-history-link]");
    if (!username || !yearSelect || !calendar || !total) return;

    const currentYear = new Date().getFullYear();

    function addYearOption(year) {
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
        if (!response.ok) throw new Error(`Contribution request failed for ${username}`);
        const data = await response.json();
        const days = data.contributions || [];

        if (days.length) {
          const leadingDays = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
          for (let index = 0; index < leadingDays; index += 1) {
            const empty = document.createElement("span");
            empty.className = "github-calendar__day github-calendar__day--empty";
            empty.setAttribute("role", "gridcell");
            calendar.appendChild(empty);
          }
        }

        days.forEach(function (day) {
          const cell = document.createElement("span");
          cell.className = "github-calendar__day";
          cell.setAttribute("role", "gridcell");
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

    async function initializeYears() {
      let years = [];
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`);
        if (!response.ok) throw new Error(`Contribution-year request failed for ${username}`);
        const data = await response.json();
        const totalYears = Object.keys(data.total || {});
        const contributionYears = (data.contributions || []).map(function (day) {
          return day.date.slice(0, 4);
        });
        years = Array.from(new Set(totalYears.concat(contributionYears)))
          .map(Number)
          .filter(function (year) { return Number.isInteger(year) && year <= currentYear; })
          .sort(function (a, b) { return b - a; });
      } catch (error) {
        const fallbackStartYear = username === "RSDRumilC" ? currentYear : 2022;
        for (let year = currentYear; year >= fallbackStartYear; year -= 1) years.push(year);
      }

      if (!years.length) years = [currentYear];
      years.forEach(addYearOption);
      loadContributions(String(years[0]));
    }

    initializeYears();
  }

  if (scrollDown) {
    function updateScrollButton() {
      const distanceFromBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      scrollDown.classList.toggle("is-hidden", distanceFromBottom < 80);
    }

    scrollDown.addEventListener("click", function (event) {
      event.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollBy({
        top: Math.max(window.innerHeight * 0.82, 420),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    window.addEventListener("scroll", updateScrollButton, { passive: true });
    window.addEventListener("resize", updateScrollButton);
    updateScrollButton();
  }

  document.querySelectorAll("[data-github-account]").forEach(setupContributionCalendar);
})();
