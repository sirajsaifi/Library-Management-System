//to manage alert messages of javasscript


//node js uses common js to implement modules but since ES6 there is modules in javascript as well
//ES6 uses export/import syntax
export const hideAlert = () => {
    const el = document.querySelector('.alert')     //removes the class = alert which was inserted in the beginning of the body using markup
    if (el) el.parentElement.removeChild(el)        //variable --> see this in showAlert function below
    //above line is used to go to the parent element and remove that parent element's child
}

//type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {     //time = 5 is default and can be overwritten by the user
    hideAlert()     //to hide all alerts before a new alert is shown
    const markup = `<div class="alert alert -${type}">${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
    window.setTimeout(hideAlert, time * 1000)       //hide the new showAlert automatically after 7 seconds
}