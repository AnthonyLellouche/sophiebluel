import { apiUrl } from './config.js';

let images = [];

//chgt des projets
export async function chargerProjets(categorie = "Tous", targetElement = ".gallery", afficherLegende = true, afficherBoutonSupprimer = false) {
    try {
        let projets = images;
        if (images.length === 0) {
            const url = `${apiUrl}/works`;
            const reponse = await fetch(url);
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP: ${reponse.status}`);
            }
            projets = await reponse.json();
            images = projets;
        }

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

//chargement catergories
export async function chargerCategories() {
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
        return categories;
    } catch (error) {
        console.log("erreur ds le chargement des categories", error);
    }
}

//suppresion projet 
export function supprimerProjet(projetId) {
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

//PARTIE AJOUT PROJET
//affichage categorie modal ajout projet
export async function affichageCategorieForm() {
    try {
        const dataCategoriesFromAPI = await chargerCategories();
        const selectElement = document.getElementById('modalAddImageCategory');
        selectElement.innerHTML = '';

        const blankOption = document.createElement('option');
        blankOption.value = '';
        blankOption.textContent = '';
        selectElement.appendChild(blankOption);

        dataCategoriesFromAPI.forEach(category => {
            const optionElement = document.createElement('option');
            optionElement.value = category.id;
            optionElement.textContent = category.name;
            selectElement.appendChild(optionElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
    }
}
affichageCategorieForm();

//ajout projet 
export async function ajoutProjet() {
    try {
        const token = sessionStorage.getItem('authToken');
        const photo = document.getElementById("imageUrl").files[0];
        const title = document.querySelector("input[name='title']").value;
        const category = document.querySelector("select[name='category.name']").value;

        const newProject = {
            title: title,
            imageUrl: URL.createObjectURL(photo),
            photo: photo,
            category: { id: category, name: document.querySelector(`select[name='category.name'] option[value='${category}']`).textContent }
        };

        if (isValidProject(newProject)) {
            const formData = new FormData();
            formData.append('title', newProject.title);
            formData.append('image', newProject.photo);
            formData.append('category', newProject.category.id);

            console.log('Données envoyées à l\'API:', formData);
            const response = await fetch(`${apiUrl}/works`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            images.push(responseData);
            console.log('Projet ajouté:', responseData);
            chargerProjets();
            fermerModal();
        } else {
            console.error('Le projet nest pas ok');
        }
    } catch (error) {
        console.error('Erreur lors de l’envoi du projet:', error);
    }
}

//fonction si projet ok
function isValidProject(project) {
    return project && project.imageUrl && project.title && project.photo && project.category && project.category.id && project.category.name;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formAjoutProjet').addEventListener('submit', function (event) {
        event.preventDefault();
        ajoutProjet();
    });
});

// Changement boutton valider
function updateButtonState() {
    const imageUrl = document.getElementById('imageUrl').value;
    const title = document.querySelector("input[name='title']").value.trim();
    const category = document.querySelector("select[name='category.name']").value;
    const button = document.getElementById('boutonValidation');

    // Vérifie si tous les champs sont bien rempli
    if (imageUrl && title && category) {
        button.style.backgroundColor = '#1d6154'
        button.disabled = false;
        button.style.cursor = 'pointer';
    } else {
        button.style.backgroundColor = 'grey';
        button.disabled = true;
        button.style.cursor = 'not-allowed';
    }
}

// ecouteur devenement pour bouton block 
document.getElementById('imageUrl').addEventListener('change', updateButtonState);
document.querySelector("input[name='title']").addEventListener('input', updateButtonState);
document.querySelector("select[name='category.name']").addEventListener('change', updateButtonState);
//initialisation dom pr bouton
document.addEventListener('DOMContentLoaded', updateButtonState);

//miniature image ds modal form
document.getElementById('imageUrl').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        //FFileReader pour lire le fichier
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImage = document.getElementById('preview-image');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';

            document.querySelector('.fa-regular.fa-image').classList.add('hidden');
            document.querySelector('.btnAjout').classList.add('hidden');
            document.querySelector('.labelFormat').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

//fermeture modals 
function fermerModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        //suppresion données du formulaire
        document.getElementById('formAjoutProjet').reset();
        const previewImage = document.getElementById('preview-image');
        previewImage.style.display = 'none';
        document.querySelector('.fa-regular.fa-image').classList.remove('hidden');
        document.querySelector('.btnAjout').classList.remove('hidden');
        document.querySelector('.labelFormat').classList.remove('hidden');
        modal.classList.add('hide');
    });
}