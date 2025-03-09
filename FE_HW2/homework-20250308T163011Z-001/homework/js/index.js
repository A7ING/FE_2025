const user_list = document.getElementById('userlist');
const spinner = document.getElementById('spinner');

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
    }).finally(hideSpinner);
}

function create_element(user) {
    const list_item = document.createElement('li');

    const name_tag = document.createElement('input');
    name_tag.value = user.name;

    const email_tag = document.createElement('input');
    email_tag.value = user.email;

    const edit_button = document.createElement('button');
    edit_button.textContent = 'Edit';
    edit_button.onclick = () => update_user(user.id, name_tag.value, email_tag.value);

    const delete_button = document.createElement('button');
    delete_button.textContent = 'Delete';
    delete_button.onclick = () => {
        showSpinner();
        fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, { method: 'DELETE' })
            .then(() => user_list.removeChild(list_item))
            .finally(hideSpinner);
    };

    list_item.append(name_tag, email_tag, edit_button, delete_button);
    user_list.appendChild(list_item);
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
