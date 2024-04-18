const apiUrl = "http://localhost:5678/api";

//page de co
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector('#login form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            fetch(`${apiUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Echec de la connexion');
                    }
                })
                .then(data => {
                    sessionStorage.setItem('authToken', data.token);
                    window.location.href = '/FrontEnd';
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    document.getElementById('error-message').innerText = error.message;
                });
        });
    }
});

