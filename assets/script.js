const apiUrl = "http://localhost:5678/api";

async function chargerProjets(categorie = "Tous") {
  try {
    const url = `${apiUrl}/works`;
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }
    const projets = await reponse.json();

    let projetsFiltres = projets;
    if (categorie !== "Tous") {
      projetsFiltres = projets.filter(
        (projet) => projet.category.name === categorie
      );
    }

    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = "";

    projetsFiltres.forEach((projet) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = projet.imageUrl;
      img.alt = projet.title;
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = projet.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      galerie.appendChild(figure);
    });
  } catch (error) {
    console.log("erreur ds le chgt du projet", error);
  }
}

async function chargerCategories() {
  try {
    const url = `${apiUrl}/categories`;
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }
    const categories = await reponse.json();

    const filterContainer = document.getElementById("filter");
    filterContainer.innerHTML = "";

    const tousButton = document.createElement("button");
    tousButton.classList.add("filter-button");
    tousButton.dataset.category = "Tous";
    tousButton.textContent = "Tous";
    tousButton.addEventListener("click", () => {
      chargerProjets("Tous");
    });
    filterContainer.appendChild(tousButton);

    categories.forEach((categorie) => {
      const button = document.createElement("button");
      button.classList.add("filter-button");
      button.dataset.category = categorie.name;
      button.textContent = categorie.name;
      button.addEventListener("click", () => {
        chargerProjets(categorie.name);
      });
      filterContainer.appendChild(button);
    });
  } catch (error) {
    console.log("erreur ds le chargement des categories", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  chargerProjets();
  chargerCategories();

  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const categorieSelectionnee = button.dataset.category;
      chargerProjets(categorieSelectionnee);
    });
  });
});