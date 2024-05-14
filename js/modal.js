// Sélecteur pour les modale et les boutons
const firstModal = document.querySelector(".modal-overlay");
const secondModal = document.querySelector(".new-modal");
const openFirstModalBtn = document.querySelector("#openModalAjout");
const closeFirstModalBtn = firstModal.querySelector(".close-modal-btn");
const closeSecondModalBtn = secondModal.querySelector(".close-modal-btn");
const backArrowBtn = secondModal.querySelector(".arrow-modal-btn");

// Ouv 1 er modal
openFirstModalBtn.addEventListener("click", () => {
  firstModal.classList.remove("hide");
});

// Ferm de la 1ere modale
closeFirstModalBtn.addEventListener("click", () => {
  firstModal.classList.add("hide");
});

// Ouv 2 eme modale
openFirstModalBtn.addEventListener("click", () => {
  secondModal.classList.remove("hide");
});

// Ferm de la 2 eme modale avec le bouton close
closeSecondModalBtn.addEventListener("click", () => {
  secondModal.classList.add("hide");
  firstModal.classList.add("hide");
});

// Retour à la première modale avec la flèche
backArrowBtn.addEventListener("click", () => {
  secondModal.classList.add("hide");
  firstModal.classList.remove("hide");
});

// Ferm des modale lors du clic à l'extérieur
[firstModal, secondModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hide");
      firstModal.classList.add("hide"); 
    }
  });
});
