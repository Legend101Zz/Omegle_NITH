const nodemailer= require('nodemailer')
const sendgridTransport= require('nodemailer-sendgrid-transport') 
const transporter= nodemailer.createTransport(sendgridTransport({
    auth :
    {
        api_key : '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'
    }
}))
module.exports = transporter;