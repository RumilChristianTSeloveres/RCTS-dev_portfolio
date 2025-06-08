// js/custom-elements/skills-carousel.js
const skills = [
  { img: "images/assets/C.png", label: "C" },
  { img: "images/assets/C1.png", label: "C#" },
  { img: "images/assets/C++.png", label: "C++" },
  { img: "images/assets/Java1.png", label: "Java" },
  { img: "images/assets/Python.png", label: "Python" },
  { img: "images/assets/HTML.png", label: "HTML" },
  { img: "images/assets/CSS.png", label: "CSS" },
  { img: "images/assets/Javascript.png", label: "Javascript" },
  { img: "images/assets/Laravel.png", label: "Laravel" },
  { img: "images/assets/Figma.png", label: "Figma" },
  { img: "images/assets/AdobeIllustrator.png", label: "Adobe Illustrator" },
  { img: "images/assets/Mysql.png", label: "MySQL" },
  { img: "images/assets/FreeCAD.png", label: "FreeCAD" },
  { img: "images/assets/TinkerCAD.png", label: "TinkerCAD" },
  { img: "images/assets/Autocad.png", label: "AutoCAD" },
  { img: "images/assets/AutodeskFusion.png", label: "Autodesk Fusion" },
  { img: "images/assets/UltimakerCura.png", label: "Ultimaker Cura" },
  { img: "images/assets/Scenebuilder.png", label: "SceneBuilder" },
  { img: "images/assets/Notepad++.png", label: "Notepad++" },
  { img: "images/assets/Arduino.png", label: "Arduino" },
  { img: "images/assets/Proteus.png", label: "Proteus" },
  { img: "images/assets/Fritzing.png", label: "Fitzing" },
  { img: "images/assets/EagleCAD.png", label: "EagleCAD" },
  { img: "images/assets/CircuitWizard.png", label: "Circuit Wizard" },
  { img: "images/assets/HardwareProjects.png", label: "Hardware Projects" },
];

let currentPage = 0;
const skillsPerPage = 8;
let totalPages = Math.ceil(skills.length / skillsPerPage);
let startX = null;

function renderSkills(page = 0) {
  const container = document.getElementById("skills-carousel");
  if (!container) return;
  container.innerHTML = "";

  const start = page * skillsPerPage;
  const end = Math.min(start + skillsPerPage, skills.length);
  const pageSkills = skills.slice(start, end);

  // Create 2 rows, 4 columns each
  for (let row = 0; row < 2; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "skills-row";
    for (let col = 0; col < 4; col++) {
      const skillIndex = row * 4 + col;
      if (pageSkills[skillIndex]) {
        const skill = pageSkills[skillIndex];
        const card = document.createElement("div");
        card.className = "clients-list__item";
        card.innerHTML = `
          <a href="#0">
            <img src="${skill.img}" alt="${skill.label}" />
            <p class="desc">${skill.label}</p>
          </a>
        `;
        rowDiv.appendChild(card);
      }
    }
    container.appendChild(rowDiv);
  }

  // Navigation with arrows and dots
  const nav = document.createElement("div");
  nav.className = "skills-carousel-nav";
  nav.innerHTML = `
    <!-- Arrow area: Edit MDI icons here if needed in the future -->
    <button class="skills-carousel-arrow" id="skills-prev" ${
      page === 0 ? "disabled" : ""
    } title="Previous">
      <i class="mdi mdi-chevron-left"></i>
    </button>
    <!-- Dot area: Edit dot indicator style here if needed in the future -->
    <div class="skills-carousel-dots">
      ${Array.from({ length: totalPages })
        .map(
          (_, i) =>
            `<button class="skills-carousel-dot${
              i === page ? " active" : ""
            }" data-page="${i}"></button>`
        )
        .join("")}
    </div>
    <button class="skills-carousel-arrow" id="skills-next" ${
      end >= skills.length ? "disabled" : ""
    } title="Next">
      <i class="mdi mdi-chevron-right"></i>
    </button>
  `;
  container.appendChild(nav);

  document.getElementById("skills-prev").onclick = () => {
    if (currentPage > 0) {
      currentPage--;
      renderSkills(currentPage);
    }
  };
  document.getElementById("skills-next").onclick = () => {
    if (end < skills.length) {
      currentPage++;
      renderSkills(currentPage);
    }
  };
  // Dot navigation
  container.querySelectorAll(".skills-carousel-dot").forEach((dot) => {
    dot.onclick = (e) => {
      const pageNum = parseInt(e.target.getAttribute("data-page"));
      currentPage = pageNum;
      renderSkills(currentPage);
    };
  });

  // Touch/swipe support
  container.ontouchstart = function (e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
    }
  };
  container.ontouchend = function (e) {
    if (startX !== null && e.changedTouches.length === 1) {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && currentPage < totalPages - 1) {
          currentPage++;
          renderSkills(currentPage);
        } else if (diff > 0 && currentPage > 0) {
          currentPage--;
          renderSkills(currentPage);
        }
      }
      startX = null;
    }
  };
}

document.addEventListener("DOMContentLoaded", () => renderSkills());
