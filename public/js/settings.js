//to update user's password by user and his/her password 

import axios from 'axios'
import { showAlert } from './alerts'
import catchAsync from '../../utils/catchAsync'


//node js uses common js to implement modules but since ES6 there is modules in javascript as well
//ES6 uses export/import syntax

//type is either 'password' or 'data'
export const updateSettings = async(data, type) => {
    try {
        const url = type === 'password'? 'http://127.0.0.1:5500/api/v1/users/updateMyPassword' : 'http://127.0.0.1:5500/api/v1/users/updateMe'

        const res = await axios ({
            method: 'PATCH',
            // url: type === 'password' ? 'http://127.0.0.1:5500/api/v1/users/updateMyPassword' : 'http://127.0.0.1:5500/api/v1/users/updateMe',
            url,
            data
        })

        if(res.data.status == 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`)
        }
    }
    catch(err) {
        console.log(err)
        showAlert('error', err.response.data.message)
    }
}


export const createUser = async(data) => {
    try {
        const res = await axios({
            method: 'POST', 
            url: (process.env.NODE_ENV === 'production') ? 'api/v1/users/create-user' : 'http://127.0.0.1:5500/api/v1/users/create-user',
            data
        })

        if (res.data.status == 'success') {
            showAlert('success', 'User created successfully!')
        }

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const updateUser = async(data, id) => {
    try{
        const res = await axios({
            method: 'PATCH',
            url: (process.env.NODE_ENV === 'production') ? `api/v1/users/${id}` : `http://127.0.0.1:5500/api/v1/users/${id}`,
            data
        })
        
        if (res.data.status == 'success') {
            showAlert('success', 'User updated successfully!')
        }
        // location.reload(true)

    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const deleteUser = async(id) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: (process.env.NODE_ENV === 'production') ? `api/v1/users/${id}` : `http://127.0.0.1:5500/api/v1/users/${id}`,
            id
        })

        if(res.data.status == 'success'){
            showAlert('success', 'User deleted successfully')
        }

        window.setTimeout(() => {
            location.assign('/me')
        }, 1000)
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}