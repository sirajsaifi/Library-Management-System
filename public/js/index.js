//entry file...get data from user interface

import 'core-js'
import 'regenerator-runtime/runtime'


import { showAlert } from './alerts'
import { login, logout } from './login'
import { updateAccount, updatePassword, createUser, updateUser,
deleteUser, createBook,updateBook, deleteBook, issueBook, returnBook} from './settings'
//we used import method above because we are using using export/import method of ES6 for frontend
//and the files we are importing are using export method of ES6


const loginForm = document.querySelector('#login-form')
const logoutBtn = document.querySelector('.nav-logout-button')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const createUserForm = document.querySelector('.create-user-form')
const updateUserForm = document.querySelector('#update-user-form')
const deleteUserForm = document.querySelector('#delete-user-form')
const createBookForm = document.querySelector('.create-book-form')
const deleteBookForm = document.querySelector('#delete-book-form')
const updateBookForm = document.querySelector('#update-book-form')
const bookStateChanger = document.getElementById('book-state')
const issueBookForm = document.querySelector('#issue-book-form')
const returnBookForm = document.querySelector('#return-book-form')


if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
  })


if (logoutBtn) logoutBtn.addEventListener('click', logout)


if (userDataForm) userDataForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('save-settings-btn').textContent = 'Updating...'

  const name = document.getElementById('name').value
  const gender = document.getElementById('gender').value

  const form = new FormData()
  form.append('name', name.charAt(0).toUpperCase() + name.slice(1))
  form.append('email', document.getElementById('email').value)
  form.append('gender', gender.charAt(0).toUpperCase() + gender.slice(1))
  form.append('number', document.getElementById('number').value)
  form.append('photo', document.getElementById('photo').files[0])

  await updateAccount(form)
  
  document.getElementById('save-settings-btn').textContent = 'Save settings'
})


if (userPasswordForm) userPasswordForm.addEventListener('submit', async e => {
  //async is used because we are changing the text content
  e.preventDefault()

  document.getElementById('save-password-btn').textContent = 'Updating...'

  const passwordCurrent = document.getElementById('current-password').value
  const password = document.getElementById('new-password').value
  const passwordConfirm = document.getElementById('confirm-password').value

  //await is used because we are changing the text content
  await updatePassword({ passwordCurrent, password, passwordConfirm })
  document.getElementById('save-password-btn').textContent = 'Save Password'
  userPasswordForm.reset()
  //to reset the value coloumns to blank after update
})


if (createUserForm) createUserForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('create-user-btn').textContent = 'Creating User'

  const getRole = document.getElementById('role').value
  const getName = document.getElementById('name').value
  const getGender = document.getElementById('gender').value

  const name = getName.charAt(0).toUpperCase() + getName.slice(1)
  const email = document.getElementById('email').value
  const role = getRole.charAt(0).toLowerCase() + getRole.slice(1)
  const gender = getGender.charAt(0).toUpperCase() + getGender.slice(1)
  const number = document.getElementById('number').value
  const password = document.getElementById('password').value
  const passwordConfirm = document.getElementById('confirm-password').value

  await createUser({ name, email, role, gender, number, password, passwordConfirm })
  document.getElementById('create-user-btn').textContent = 'Create User'
  createUserForm.reset()
})


if (updateUserForm) updateUserForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('update-user').textContent = 'Updating...'
  
  const getName = document.getElementById('name').value
  const getGender = document.getElementById('gender').value

  const name = getName.charAt(0).toUpperCase() + getName.slice(1)
  const email = document.getElementById('email').value
  const gender = getGender.charAt(0).toUpperCase() + getGender.slice(1)
  const number = document.getElementById('number').value
  
  const id = document.getElementById('id').value
  
  await updateUser({name, email, gender, number}, id)
  document.getElementById('update-user').textContent = 'Update'
})


if (deleteUserForm) deleteUserForm.addEventListener('submit', async e => {
  e.preventDefault()

  const id = document.getElementById('id').value

  deleteUser(id)
})


if (createBookForm) createBookForm.addEventListener('submit', async e => {
  e.preventDefault()
  document.getElementById('create-book-btn').textContent = 'Creating...'
  
  const getBookName = document.getElementById('book-name').value
  const getBookAuthor = document.getElementById('book-author').value
  const getBookPublisher = document.getElementById('book-publisher').value
  
  const bookName = getBookName.charAt(0).toUpperCase() + getBookName.slice(1)
  const bookAuthor =  getBookAuthor.charAt(0).toUpperCase() + getBookAuthor.slice(1)
  const bookPublisher = getBookPublisher.charAt(0).toUpperCase() + getBookPublisher.slice(1)
  const bookPages =  document.getElementById('book-pages').value
  const bookPrice = document.getElementById('book-price').value
  const bookState = document.getElementById('create-book-state').value
  
  await createBook({bookName, bookAuthor, bookPublisher, bookPages, bookPrice, bookState})
  document.getElementById('create-book-btn').textContent = 'Create Book'
  createBookForm.reset()
})


if (updateBookForm) updateBookForm.addEventListener('submit', async e => {
  e.preventDefault()
  document.getElementById('update-book').textContent = 'Updating...'
  
  const getBookName = document.getElementById('book-name').value
  const getBookAuthor = document.getElementById('book-author').value
  const getBookPublisher = document.getElementById('book-publisher').value
  
  const bookName = getBookName.charAt(0).toUpperCase() + getBookName.slice(1)
  const bookAuthor = getBookAuthor.charAt(0).toUpperCase() + getBookAuthor.slice(1)
  const bookPublisher = getBookPublisher.charAt(0).toUpperCase() + getBookPublisher.slice(1)
  const bookPages = document.getElementById('book-pages').value
  const bookPrice = document.getElementById('book-price').value
  const bookState = document.getElementById('book-state').value
  const image = document.getElementById('photo').files[0]
  
  const id = document.getElementById('book-id').value
  
  await updateBook({bookName, bookAuthor, bookPublisher, bookPages, bookPrice, bookState, image}, id)
  document.getElementById('update-book').textContent = 'Update'
})


if (deleteBookForm) deleteBookForm.addEventListener('submit', e => {
  e.preventDefault()
  const id = document.getElementById('book-id').value
  deleteBook(id)
})


if (issueBookForm) issueBookForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('issue-book').textContent = 'Issuing...'
  
  const book = document.getElementById('book-issue-name').value
  const userEmail = document.getElementById('book-issue-student-email').value
  
  await issueBook({book, userEmail})
  document.getElementById('issue-book').textContent = 'Issue'
  issueBookForm.reset()
})


if (returnBookForm) returnBookForm.addEventListener('submit', async e => {
  e.preventDefault()

  document.getElementById('return-book').textContent = 'Returning...'
  
  const id = document.getElementById('book-return-id').value
  const status = document.getElementById('book-return-status').value
  const returnedOn = new Date().toISOString().slice(0, 10)
  
  await returnBook({status, returnedOn}, id)
  
  document.getElementById('return-book').textContent = 'Return'
})


// var links = document.querySelectorAll('li');
// links.forEach(function (element) {
//   element.addEventListener('click', function (e) {
//     links.forEach(function (element) {
//       element.classList.remove('active');
//     });
//     this.classList.add('active');
//   });
// });