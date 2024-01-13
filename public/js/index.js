//entry file...get data from user interface

import 'core-js'
import 'regenerator-runtime/runtime'


import { showAlert } from './alerts'
import { login, logout } from './login'
//we used import method above because we are using using export/import method of ES6 for frontend
//and the files we are importing are using export method of ES6


const loginForm = document.querySelector('#login-form')
const logoutBtn = document.querySelector('.nav-logout-button')


if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })