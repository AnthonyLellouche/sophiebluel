const apiUrl = "http://localhost:5678/api";

//chgt des projets
async function chargerProjets(categorie = "Tous", targetElement = ".gallery", afficherLegende = true, afficherBoutonSupprimer = false) {
  try {
    const url = `${apiUrl}/works`;
    const reponse = await fetch(url);
    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }
    const projets = await reponse.json();

    let projetsFiltres = (categorie !== "Tous") ? projets.filter(projet => projet.category.name === categorie) : projets;

    const galerie = document.querySelector(targetElement);
    galerie.innerHTML = "";

    projetsFiltres.forEach((projet) => {
      const figure = document.createElement("figure");
      figure.setAttribute('data-id', projet.id);
      const img = document.createElement("img");
      img.src = projet.imageUrl;
      img.alt = projet.title;
      figure.appendChild(img);

      if (afficherLegende) {
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = projet.title;
        figure.appendChild(figcaption);
      }

      if (afficherBoutonSupprimer) {
        const btnSupprimer = document.createElement("button");
        btnSupprimer.classList.add("delete-button");
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-trash-can";
        btnSupprimer.appendChild(icon)
        btnSupprimer.onclick = function () {
          supprimerProjet(projet.id);
        };
        figure.appendChild(btnSupprimer);
      }
      galerie.appendChild(figure);
    });
  } catch (error) {
    console.log("Erreur dans le chargement des projets", error);
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
    window.location.href = 'index.html';
  });
}

//modal

const openBtn = document.querySelector("#modifier");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-modal-btn");

function openModal() {
  modal.classList.remove("hide");
}

function closeModal(e, clickedOutside = false) {
  if (clickedOutside) {
    if (e.target.classList.contains("modal-overlay"))
      modal.classList.add("hide");
  } else modal.classList.add("hide");
}

openBtn.addEventListener("click", openModal);
modal.addEventListener("click", (e) => closeModal(e, true));
closeBtn.addEventListener("click", closeModal);

openBtn.addEventListener("click", () => {
  openModal();
  chargerProjets("Tous", ".modal-gallery", false, true);
  console.log(chargerProjets);
});

window.addEventListener('keydown', function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
})

//suppresion projet 

function supprimerProjet(projetId) {
  const token = sessionStorage.getItem('authToken')
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    return;
  }

  fetch(`${apiUrl}/works/${projetId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    if (response.ok) {
      console.log('Projet supprimé avec succès');
      const elementsASupprimer = document.querySelectorAll(`figure[data-id="${projetId}"]`);
      elementsASupprimer.forEach(el => el.remove());
    } else {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  }).catch(error => {
    console.error('Erreur lors de la suppression du projet', error);
  });
}