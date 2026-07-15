const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");
const year = document.querySelector("#current-year");
const filterButtons = document.querySelectorAll(".filter-button");
const subcategoryGroups = document.querySelectorAll(".subcategory-filters");
const subcategoryButtons = document.querySelectorAll(".subcategory-button");
const projects = document.querySelectorAll(".project");
const filterResult = document.querySelector(".filter-result");

function getFileName(path) {
  return decodeURIComponent(path)
    .replaceAll("\\", "/")
    .split("/")
    .pop()
    .split("?")[0]
    .split("#")[0];
}

function readProjectCatalog(documentSource) {
  const registeredFiles = new Set();

  return [...documentSource.querySelectorAll(".project")]
    .map((project) => {
      const title = project.querySelector(".project-info h3")?.textContent.trim();
      const link = project.querySelector(".project-info a[href]")?.getAttribute("href");
      const file = link ? getFileName(link) : "";

      return { title, file };
    })
    .filter((project) => {
      if (!project.title || !project.file || registeredFiles.has(project.file)) return false;
      registeredFiles.add(project.file);
      return true;
    });
}

async function setupProjectNavigation() {
  const nextLink = document.querySelector(".next-project");

  if (!nextLink) return;

  const previousLink = document.createElement("a");
  const previousLabel = document.createElement("span");
  const previousTitle = document.createElement("strong");

  previousLink.className = "previous-project";
  previousLink.href = "../index.html#trabalhos";
  previousLabel.textContent = "← Projeto anterior";
  previousTitle.textContent = "Carregando…";
  previousLink.append(previousLabel, previousTitle);
  nextLink.before(previousLink);

  const nextLabel = nextLink.querySelector("span");
  const nextTitle = nextLink.querySelector("strong");

  try {
    const response = await fetch("../index.html");
    if (!response.ok) throw new Error("Não foi possível carregar a lista de projetos.");

    const indexContent = await response.text();
    const indexDocument = new DOMParser().parseFromString(indexContent, "text/html");
    const catalog = readProjectCatalog(indexDocument);
    const currentFile = getFileName(window.location.pathname);
    const currentIndex = catalog.findIndex((project) => project.file === currentFile);

    if (currentIndex < 0 || catalog.length < 2) {
      throw new Error("Projeto atual não encontrado na página inicial.");
    }

    const previousProject = catalog[(currentIndex - 1 + catalog.length) % catalog.length];
    const nextProject = catalog[(currentIndex + 1) % catalog.length];

    previousLink.href = previousProject.file;
    previousLink.setAttribute("aria-label", `Voltar para o projeto anterior: ${previousProject.title}`);
    previousTitle.textContent = previousProject.title;

    nextLink.href = nextProject.file;
    nextLink.setAttribute("aria-label", `Ir para o próximo projeto: ${nextProject.title}`);
    nextTitle.textContent = `${nextProject.title} →`;
  } catch (error) {
    previousLink.hidden = true;
    nextLink.href = "../index.html#trabalhos";
    nextLabel.textContent = "Navegação";
    nextTitle.textContent = "Ver todos os projetos →";
  }
}

setupProjectNavigation();

function numberProjects() {
  projects.forEach((project, index) => {
    const numberElement = project.querySelector(".project-image > span");

    if (numberElement) {
      numberElement.textContent = String(index + 1).padStart(2, "0");
    }
  });
}

numberProjects();

function closeMenu() {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menu.classList.toggle("open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
year.textContent = new Date().getFullYear();

const categoryNames = {
  todos: "todos os trabalhos",
  producao: "trabalhos de produção",
  fotografia: "trabalhos de fotografia",
  edicao: "trabalhos de edição",
  diversos: "trabalhos diversos",
};

const subcategoryNames = {
  "direcao-foto": "direção de foto",
  "foto-still": "foto still",
  "fotografia-digital": "fotografia digital",
  direcao: "direção",
  "direcao-som": "direção de som",
  roteiros: "roteiros",
};

function filterProjects(category, subcategory = "todos") {
  projects.forEach((project) => {
    const matchesCategory =
      category === "todos" || project.dataset.category === category;
    const matchesSubcategory =
      subcategory === "todos" || project.dataset.subcategory === subcategory;

    project.hidden = !(matchesCategory && matchesSubcategory);
  });
}

function showSubcategoryGroup(category) {
  subcategoryGroups.forEach((group) => {
    group.hidden = group.dataset.category !== category;

    group.querySelectorAll(".subcategory-button").forEach((button) => {
      const isAllButton = button.dataset.subfilter === "todos";
      button.classList.toggle("active", isAllButton);
      button.setAttribute("aria-pressed", String(isAllButton));
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    showSubcategoryGroup(selectedCategory);
    filterProjects(selectedCategory);

    filterResult.textContent = `Exibindo ${categoryNames[selectedCategory]}`;
  });
});

subcategoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest(".subcategory-filters");
    const selectedCategory = group.dataset.category;
    const selectedSubcategory = button.dataset.subfilter;

    group.querySelectorAll(".subcategory-button").forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    filterProjects(selectedCategory, selectedSubcategory);
    filterResult.textContent =
      selectedSubcategory === "todos"
        ? `Exibindo ${categoryNames[selectedCategory]}`
        : `Exibindo trabalhos de ${subcategoryNames[selectedSubcategory]}`;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
