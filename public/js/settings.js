//to update user's password by user and his/her password 

import axios from 'axios'
import { showAlert } from './alerts'
import catchAsync from '../../utils/catchAsync'


//node js uses common js to implement modules but since ES6 there is modules in javascript as well
//ES6 uses export/import syntax

export const updateAccount = async(data) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? '/api/v1/users/updateMe' : 'http://127.0.0.1:5500/api/v1/users/updateMe',
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Your account was successfully updated.')
        }
        location.reload(true)
    }
    catch(err) {
        showAlert('error', err.data.response.message)
    }
}


export const updatePassword = async(data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? '/api/v1/users/updateMyPassword' : 'http://127.0.0.1:5500/api/v1/users/updateMyPassword',
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Your password was successfully updated.')
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const createUser = async(data) => {
    try {
        const res = await axios({
            method: 'POST', 
            url: (process.env.NODE_ENV === 'production') ? '/api/v1/users/create-user' : 'http://127.0.0.1:5500/api/v1/users/create-user',
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'User was successfully created.')
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const updateUser = async(data, id, role) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? `/api/v1/users/${id}` : `http://127.0.0.1:5500/api/v1/users/${id}`,
            data
        }) 

        if (res.data.status == 'success') {
            showAlert('success', `User updated successfully.`)
        }

        if (role === 'student') {
            window.setTimeout(() => {
                location.assign('/students')
            }, 1000)
        }
        else if (role === 'staff') {
            window.setTimeout(() => {
                location.assign('/staff')
            }, 1000)
        }

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const deleteUser = async(id, role) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: (process.env.NODE_ENV === 'production') ? `/api/v1/users/${id}` : `http://127.0.0.1:5500/api/v1/users/${id}`,
            id
        })
        
        showAlert('success', 'User deleted successfully.')
        
        if (role === 'student') {
            window.setTimeout(() => {
                location.assign('/students')
            }, 1000)
        }
        else if (role === 'staff') {
            window.setTimeout(() => {
                location.assign('/staff')
            }, 1000)
        }

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const createBook = async(data) => {
    try {
        const res = await axios({
            method: 'POST', 
            url: (process.env.NODE_ENV === 'production') ? '/api/v1/books/create-book' : 'http://127.0.0.1:5500/api/v1/books/create-book',
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Book was successfully created.')
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const updateBook = async(data, id) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? `/api/v1/books/${id}` :`http://127.0.0.1:5500/api/v1/books/${id}`,
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Book updated successfully.')
        }

        window.setTimeout(() => {
            location.assign('/books')
        }, 1000)

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const deleteBook = async(id) => {
    try{
        const res = await axios({
            method: 'DELETE',
            url: (process.env.NODE_ENV === 'production') ? `/api/v1/books/${id}` : `http://127.0.0.1:5500/api/v1/books/${id}`,
            id
        })
        showAlert('success', 'Book deleted successfully.')

        window.setTimeout(() => {
            location.assign('/books')
        }, 1000)
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const issueBook = async(data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: (process.env.NODE_ENV === 'production') ? '/api/v1/issueBooks/issue-book' : `http://127.0.0.1:5500/api/v1/issueBooks/issue-book`,
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Book issued successfully.')
        }
        window.setTimeout(() => {
            location.assign('/books')
        })

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}

export const returnBook = async(data, id) => {
    try {
        const res = await axios ({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? `/api/v1/issueBooks/${id}` : `http://127.0.0.1:5500/api/v1/issueBooks/${id}`,
            data
        })
        if (res.data.status == 'success') {
            showAlert('success', 'Book returned successfully.')
        }
        window.setTimeout(() => {
            location.assign('/books-issued')
        })
    }
    catch (err) {
        showAlert('error', err.response.data.message)
    }
}

