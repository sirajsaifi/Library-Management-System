import axios from 'axios'
import { showAlert } from './alerts'


//node js uses common js to implement modules but since ES6 there is modules in javascript as well
//ES6 uses export/import syntax
export const login = async(email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url : (process.env.NODE_ENV === 'production') ? '/api/v1/users/login' : 'http://127.0.0.1:3000/api/v1/users/login',
            data : {
                email, password
            }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!')
            window.setTimeout(() => {   //reloading of the page
                location.assign('/')    //to load another page and we go the the homepage
            }, 1500)
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}


export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET', 
            url: '/api/v1/users/logout'
        })

        if (res.data.status === 'success') location.reload(true)
    }
    catch(err) {
        console.log(err.response)   //if noo internet connection etc
        showAlert('error', 'Error in logging out. Try again!')
    }
}