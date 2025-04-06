const user_list = document.getElementById('userlist');
const spinner = document.getElementById('spinner');

const editForm = document.createElement('form');
editForm.style.display = 'none';
const nameInput = document.createElement('input');
nameInput.type = 'text';
const emailInput = document.createElement('input');
emailInput.type = 'email';
const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.type = 'submit';
editForm.append(nameInput, emailInput, saveButton);
user_list.parentNode.insertBefore(editForm, user_list);

let currentUserId = null;
let currentCard = null;

function showSpinner() {
    spinner.style.display = 'block';
}

function hideSpinner() {
    spinner.style.display = 'none';
}

function update_user(id, name, email) {
    showSpinner();
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ id, name, email }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    }).then(() => {
        currentCard.querySelector('.name').textContent = name;
        currentCard.querySelector('.email').textContent = email;
        editForm.style.display = 'none';
    }).finally(hideSpinner);
}

saveButton.onclick = (e) => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    if (newName && newEmail && currentUserId) {
        update_user(currentUserId, newName, newEmail);
    }
};

function create_element(user) {
    const card = document.createElement('li');
    card.id = `user-${user.id}`;
    card.classList.add('card');

    const nameTag = document.createElement('p');
    nameTag.classList.add('name');
    nameTag.textContent = user.name;

    const emailTag = document.createElement('p');
    emailTag.classList.add('email');
    emailTag.textContent = user.email;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => {
        currentUserId = user.id;
        currentCard = card;
        nameInput.value = user.name;
        emailInput.value = user.email;
        editForm.style.display = 'block';
        editForm.scrollIntoView({ behavior: 'smooth' });
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        showSpinner();
        fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, { method: 'DELETE' })
            .then(() => user_list.removeChild(card))
            .finally(hideSpinner);
    };

    card.append(nameTag, emailTag, editButton, deleteButton);
    user_list.appendChild(card);
}

function load_users() {
    showSpinner();
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(create_element);
        })
        .finally(hideSpinner);
}

document.addEventListener('DOMContentLoaded', load_users);