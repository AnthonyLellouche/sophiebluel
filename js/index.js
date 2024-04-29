import { chargerProjets, chargerCategories } from './work.js';

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

//ouverture modal liste projet
function openModal() {
  modal.classList.remove("hide");
}

//fermeture modal
function closeModal(e, clickedOutside = false) {
  if (clickedOutside) {
    if (e.target.classList.contains("modal-overlay"))
      modal.classList.add("hide");
    //reset modal au clique fermer
    document.getElementById('formAjoutProjet').reset();
    const previewImage = document.getElementById('preview-image');
    previewImage.style.display = 'none';
    document.querySelector('.fa-regular.fa-image').classList.remove('hidden');
    document.querySelector('.btnAjout').classList.remove('hidden');
    document.querySelector('.labelFormat').classList.remove('hidden');
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

//Ouverture modal ajout projet
const openNewModalBtn = document.querySelector("#openModalAjout");
const newModal = document.querySelector(".new-modal");
const closeNewModalBtn = newModal.querySelector(".close-modal-btn");

openNewModalBtn.addEventListener("click", () => {
  newModal.classList.remove("hide");
});

closeNewModalBtn.addEventListener("click", () => {
  newModal.classList.add("hide");
});

newModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    newModal.classList.add("hide");
  }
});

