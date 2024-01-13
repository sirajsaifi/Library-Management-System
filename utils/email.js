const nodemailer = require('nodemailer')


module.exports = class Email {
    constructor (user, url) {
        this.to = user.email,
        this.firstName = user.name.split(' ')[0],
        this.url = url,
        this.from = `Siraj Saifi <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    async send(template, subject) {
        //2)define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: 'Forgot your password? Submit a PATCH request with your new password and passwordConfirm to'
        }

        //3) create transport and send email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (Valid for only 10 minutes)')
    }
}