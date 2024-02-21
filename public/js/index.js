//entry file...get data from user interface

import 'core-js'
import 'regenerator-runtime/runtime'


import { showAlert } from './alerts'
import { login, logout } from './login'
import { updateSettings, createUser, updateUser, deleteUser} from './settings'
//we used import method above because we are using using export/import method of ES6 for frontend
//and the files we are importing are using export method of ES6


const loginForm = document.querySelector('#login-form')
const logoutBtn = document.querySelector('.nav-logout-button')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const createUserForm = document.querySelector('.create-user-form')
const updateUserForm = document.querySelector('#update-user-form')
const deleteUserForm = document.querySelector('#delete-user-form')


if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })


if (logoutBtn) logoutBtn.addEventListener('click', logout)


if (userDataForm) userDataForm.addEventListener('submit', e => {
  e.preventDefault()
  const form = new FormData()
  form.append('name', document.getElementById('name').value)
  form.append('email', document.getElementById('email').value)
  form.append('gender', document.getElementById('gender').value)
  form.append('number', document.getElementById('number').value)
  form.append('photo', document.getElementById('photo').files[0])
  updateSettings(form, 'data')
})


if (userPasswordForm) userPasswordForm.addEventListener('submit', async e => {
  //async is used because we are changing the text content
  e.preventDefault()

  document.getElementById('save-password-btn').textContent = 'Updating...'

  const passwordCurrent = document.getElementById('current-password').value
  const password = document.getElementById('new-password').value
  const passwordConfirm = document.getElementById('confirm-password').value

  //await is used because we are changing the text content
  await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')
  document.getElementById('save-password-btn').textContent = 'Save Password'
  userPasswordForm.reset()
  //to reset the value coloumns to blank after update
})


if (createUserForm) createUserForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('create-user-btn').textContent = 'Creating User'

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const role = document.getElementById('role').value
  const gender = document.getElementById('gender').value
  const number = document.getElementById('number').value
  const password = document.getElementById('password').value
  const passwordConfirm = document.getElementById('confirm-password').value

  await createUser({ name, email, role, gender, number, password, passwordConfirm })
  document.getElementById('create-user-btn').textContent = 'Create User'
  createUserForm.reset()
})


if (updateUserForm) updateUserForm.addEventListener('submit', e => {
  e.preventDefault()
  // const id = req.query.id
  const form = new FormData()
  form.append('name', document.getElementById('name').value)
  form.append('email', document.getElementById('email').value)
  form.append('gender', document.getElementById('gender').value)
  form.append('number', document.getElementById('number').value)

  const id = document.getElementById('id').value

  updateUser(form, id)
})


if (deleteUserForm) deleteUserForm.addEventListener('submit', e => {
  e.preventDefault()

  const id = document.getElementById('id').value

  deleteUser(id)
})


var links = document.querySelectorAll('li');
links.forEach(function (element) {
  element.addEventListener('click', function (e) {
    links.forEach(function (element) {
      element.classList.remove('active');
    });
    this.classList.add('active');
  });
});