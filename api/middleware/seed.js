/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */
// Insert seed models below
const bcrypt = require("bcrypt");
var user = require('../models/user');

bcrypt.hash('Test@123', 10, (err, hash) => {
    var admin = new user({
        email: 'admin@ackezy.com',
        password: hash,
        firstName: 'Ackezy',
        lastName: 'Admin',
        mobileNo: '1234567890',
        userType: 'Super-Admin'
    });
    user.findOne({ email: 'admin@ackezy.com' }, function(error, docs) {
        if (!docs) {
            user.create(admin, function(err, user) {
                if (err) {
                    console.log("Error creating default admin : " + err);
                }
            })
        }
    })
})