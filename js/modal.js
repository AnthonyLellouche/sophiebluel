// selecteur pour les modale et les boutons
const modals = {
  firstModal: document.querySelector(".modal-overlay"),
  secondModal: document.querySelector(".new-modal")
};

const buttons = {
  openFirstModalBtn: document.querySelector("#openModalAjout"),
  closeFirstModalBtn: modals.firstModal.querySelector(".close-modal-btn"),
  closeSecondModalBtn: modals.secondModal.querySelector(".close-modal-btn"),
  backArrowBtn: modals.secondModal.querySelector(".arrow-modal-btn")
};

// fonction pour ouvrir une modal spécifique
export function openModal(modal) {
  modal.classList.remove("hide");
}

//fonction pour fermer une modal réinitialisation form
export function closeModal(modal, resetFormId = null) {
  modal.classList.add("hide");
  if (resetFormId) {
    resetForm(resetFormId);
  }
}

// Reinit form
function resetForm(formId) {
  const form = document.getElementById(formId);
  form.reset();
  document.getElementById('preview-image').style.display = 'none';
  document.querySelector('.fa-regular.fa-image').classList.remove('hidden');
  document.querySelector('.btnAjout').classList.remove('hidden');
  document.querySelector('.labelFormat').classList.remove('hidden');
}

// Event pour les boutons
buttons.openFirstModalBtn.addEventListener("click", () => {
  openModal(modals.firstModal);
});

buttons.closeFirstModalBtn.addEventListener("click", () => {
  closeModal(modals.firstModal, 'formAjoutProjet');
});

buttons.closeSecondModalBtn.addEventListener("click", () => {
  closeModal(modals.secondModal, 'formAjoutProjet');
  closeModal(modals.firstModal);
});

buttons.backArrowBtn.addEventListener("click", () => {
  closeModal(modals.secondModal);
  openModal(modals.firstModal);
});

// Ferm des modale lors du clic à l'extérieur
[modals.firstModal, modals.secondModal].forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal, 'formAjoutProjet');
    }
  });
});
