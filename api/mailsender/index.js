const nodemailer = require('nodemailer');
const EmailTemplates = require('swig-email-templates');
const path = require('path'),
    templatesDir = path.join(__dirname, '../templates');

module.exports.send_mail = function(temp_url, data, res) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "ackezymessage@gmail.com",
            pass: "Ackezy@123"
        }
    });

    var templates = new EmailTemplates();
    templates.render(templatesDir + temp_url, data.replace_var, function(err, html, text) {
        var mailOptions = {
            from: 'ackezymessage@gmail.com', // sender address
            to: data.send_to, // list of receivers
            subject: data.subject, // Subject line
            html: html // html body
        };
        //send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res({ data: error, is_error: true, message: 'error while sending email' });
            }
            res({ data: data, is_error: false, message: 'Email sent' });
        });
    })
};