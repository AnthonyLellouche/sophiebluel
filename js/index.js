import { chargerProjets, chargerCategories } from './work.js';
import { openModal, closeModal } from './modal.js';

document.addEventListener("DOMContentLoaded", () => {
  toggleLoginLogout();
  if (document.querySelector(".gallery")) {
    chargerProjets();
    chargerCategories();
  }
  setUpModalEventListeners();
});

// co/déconnexion
function toggleLoginLogout() {
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  const isAuth = sessionStorage.getItem('authToken');
  loginLink.style.display = isAuth ? 'none' : 'block';
  logoutLink.style.display = isAuth ? 'block' : 'none';
  document.getElementById('edit-mode-banner').style.display = isAuth ? 'flex' : 'none';
  document.getElementById('modifier').style.display = isAuth ? 'flex' : 'none';
  document.getElementById('filter').style.display = isAuth ? 'none' : 'flex';
}

document.getElementById('logout-link').addEventListener('click', (event) => {
  event.preventDefault();
  sessionStorage.removeItem('authToken');
  window.location.href = 'index.html';
});

function setUpModalEventListeners() {
  const modal = document.querySelector(".modal-overlay");
  const newModal = document.querySelector(".new-modal");

  document.querySelector("#modifier").addEventListener("click", () => {
    openModal(modal);
    chargerProjets("Tous", ".modal-gallery", false, true);
  });

  document.querySelector("#openModalAjout").addEventListener("click", () => {
    openModal(newModal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) closeModal(modal, 'formAjoutProjet');
  });

  newModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) closeModal(newModal, 'formAjoutProjet');
  });

  document.querySelector(".close-modal-btn").addEventListener("click", () => closeModal(modal, 'formAjoutProjet'));
  document.querySelector(".new-modal .close-modal-btn").addEventListener("click", () => {
    closeModal(newModal, 'formAjoutProjet');
    closeModal(modal);
  });

  document.querySelector(".arrow-modal-btn").addEventListener("click", () => {
    closeModal(newModal);
    openModal(modal);
  });
}
