const apiUrl = "http://localhost:5678/api";

//chgt des projets
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

//chgt categorie
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

//login logout
function toggleLoginLogout() {
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const editModeBanner = document.getElementById('edit-mode-banner');
  const modif = document.getElementById('modifier');
  const filterContainer = document.getElementById('filter');

  if (loginLink && logoutLink) {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      loginLink.style.display = 'none';
      logoutLink.style.display = 'block';
      if (editModeBanner && modif) {
        editModeBanner.style.display = 'flex';
        modif.style.display = 'flex';
      }
      filterContainer.style.display = 'none';
    } else {
      loginLink.style.display = 'block';
      logoutLink.style.display = 'none';
      if (editModeBanner && modif) {
        editModeBanner.style.display = 'none';
        modif.style.display = 'none';
      }
      filterContainer.style.display = 'flex';
    }
  }
}

//ecouteurs d'evenement
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".gallery")) {
    chargerProjets();
    chargerCategories();
    toggleLoginLogout();
  }
});

//logout avec suppression utilisateur du local storage
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    sessionStorage.removeItem('authToken');
    window.location.href = '/FrontEnd';
  });
}