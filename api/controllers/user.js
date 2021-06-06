const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const User = require("../models/user");
const Company = require("../models/company");
const mailsender = require("../mailsender/index");

const FCM = require('fcm-node');
const serverKey = 'AAAAWOR8gc8:APA91bEjCKnknFjTgL-ru5zZssfEreFG0fauFqrd05SFNDHOf68-0YbxMwLe6TNueePKrJDBm_mJPDF-2TL1ELwYGNyLVReA9K37NSk_aAPWelbMuM2Klyl89EZ3Hnd5Hq1cwEkaGuTD'; //put your server key here
const fcm = new FCM(serverKey);

exports.user_signup = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec().then(user => {
        if (user) {
            return res.status(409).json({
                status: "ERROR",
                code: 409,
                message: "Email Already Registered!",
                data: [],
                error: []
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: "ERROR",
                        code: 500,
                        message: "Internal Server Error",
                        data: [],
                        error: err
                    });
                } else {
                    req.body.password = hash;
                    const user = new User(req.body);
                    user.save().then(result => {
                        res.status(201).json({
                            status: "CREATED",
                            code: 201,
                            message: "User Created Successfully",
                            data: [],
                            error: []
                        });
                    })
                }
            });
        }
    });
};

exports.notify_user = (req, res, next) => {

    User.find({}, function(err, user) {
        if (err != null) {
            return res.status(500).json({
                status: "ERROR",
                code: 500,
                message: "Internal Server Error",
                data: [],
                error: err
            });
        } else {
            if (user.length > 0) {
                for (var i = 0; i < user.length; i++) {
                    var messages = { title: "Ackezy", body: req.body.message };
                    var payload_data = {
                        type: "general",
                        message: messages.body,
                    };
                    if (user[i].deviceToken) {
                        var message = {
                            to: user[i].deviceToken,
                            collapse_key: 'Perform Action',
                            notification: messages,
                            data: payload_data
                        };
                        fcm.send(message, function(err, response) {
                            if (err) {
                                console.log("error when send notification admin")
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }
                }
            }
            res.status(200).json({
                status: "Send",
                code: 200,
                message: "Notification Sending",
                data: [],
                error: []
            });
        }
    });
}

exports.search_user = (req, res, next) => {
    let query = req.body;
    let mongoQuery = { userType: { $ne: 'Super-Admin' } };

    for (var key in query) {
        if (key == "search") {
            mongoQuery['$text'] = {
                '$search': query[key]
            }
        } else if (key == "mobile") {
            mongoQuery['mobileNo'] = { "$in": [query[key]] };
        } else if (key == "name") {
            var re = new RegExp(query[key], 'i');
            mongoQuery['$or'] = [
                { 'firstName': { "$in": [re] } }, { 'lastName': { "$in": [re] } }
            ]
        } else if (key == "companyuser") {
            mongoQuery['userType'] = query[key];
        } else if (key == "isMobileVerified") {
            mongoQuery['isMobileVerified'] = (true === query[key]);
        } else if (key == "fromDate") {
            mongoQuery['$and'] = [
                { 'createdDate': { "$gte": new Date(req.body.fromDate), $lt: new Date(req.body.toDate) } }
            ]
        }
    }

    User.find(mongoQuery, { score: { $meta: "textScore" } }).populate({ path: 'companyID' }).exec().then(user => {
        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "No Match Found!",
                data: [],
                error: []
            });
        } else {
            res.status(200).json({
                status: "CREATED",
                code: 200,
                message: "Match Found",
                data: user,
                error: []
            });
        }
    });
}

exports.create_com_user_by_admin = (req, res, next) => {
    var Company = require("../models/company");
    User.findOne({ companyID: { $in: [req.body.companyID] }, userType: 'Company-Admin' }, function(err, thing) {
        if (thing && thing.userType == 'Company-Admin' && req.body.userType == 'Company-Admin') {
            res.status(200).json({
                status: "OK",
                code: 200,
                message: `Company Admin Exist`,
                data: [],
                error: []
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        status: "ERROR",
                        code: 500,
                        message: "Internal Server Error",
                        data: [],
                        error: err
                    });
                } else {
                    req.body.password = hash;
                    var data = new User(req.body);
                    User.create(data, function(err, mod) {
                        if (err) {
                            return res.status(404).json({
                                status: "ERROR",
                                code: 404,
                                message: err.errmsg,
                                data: [],
                                error: err.errmsg
                            });
                        } else {
                            var mail_data = {
                                'replace_var': {
                                    name: mod.firstName + ' ' + mod.lastName
                                },
                                'send_to': mod.email,
                                'subject': 'New Company Addedd'
                            };
                            mailsender.send_mail('/admin.html', mail_data, function(response) {
                                if (response.is_error) {
                                    console.log("error in send mail")
                                } else {
                                    console.log("mail send")
                                    return res.status(200).json({
                                        status: "Created",
                                        code: 200,
                                        message: `User Created Successfully`,
                                        data: mod,
                                        error: []
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

exports.admin_login = (req, res, next) => {

    User.findOne({
        email: req.body.email,
        $or: [{ userType: 'Super-Admin' }, { userType: 'Company-Admin' }, { userType: 'Manager' }]
    }).exec().then(user => {
        if (!user) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "Username/Password Not Found!",
                data: [],
                error: []
            });
        }

        bcrypt.compare(req.body.password, user.password).then(function(resdata) {
            if (resdata) {
                const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                    process.env.JWT_KEY, {
                        expiresIn: "96h"
                    }
                );
                return res.status(200).json({
                    status: "OK",
                    code: 200,
                    message: "LOGIN SUCCESS",
                    data: {
                        token: token,
                        user: user
                    },
                    error: []
                });
            } else {
                res.status(401).json({
                    status: "ERROR",
                    code: 401,
                    message: "Username/Password Not Found!",
                    data: [],
                    error: []
                });
            }
        });
    });
};

exports.user_mobile_send_otp = (req, res, next) => {
    var random_number = Math.floor(Math.random() * 900000) + 100000;
    User.findOne({ mobileNo: req.body.mobile }).exec().then(user => {
        if (!user) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "User Not Found!",
                data: [],
                error: []
            });
        } else {
            user.registrationMobileOTP = random_number;
            user.isMobileVerified = false;
            user.otpcreated = new Date().getTime();
            user.save();
            var options = { url: "https://api.msg91.com/api/v5/otp?otp=" + random_number + "&authkey=315431AXKdaURN5e300928P1&mobile=" + user.mobileNo + "&template_id=5e3306c2d6fc055d1727c656" };
            request(options.url, function(error, response, body) {
                if (error) {
                    return res.status(401).json({
                        status: "ERROR",
                        code: 401,
                        message: "User Not Found!",
                        data: [],
                        error: []
                    });
                } else {
                    return res.status(200).json({
                        status: "OK",
                        code: 200,
                        message: "OTP Sent Successfully",
                        data: [],
                        error: []
                    });
                }
            });
        }
    })
}

exports.Verify_otp = (req, res, next) => {
    var random_number = Math.floor(Math.random() * 900000) + 100000;
    User.findOne({ mobileNo: req.body.mobile, registrationMobileOTP: req.body.otp }).exec().then(user => {
        if (!user) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "User Not Found!",
                data: [],
                error: []
            });
        } else {
            user.isMobileVerified = true;
            user.save();
            const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                },
                process.env.JWT_KEY, {
                    expiresIn: "96h"
                }
            );
            return res.status(200).json({
                status: "OK",
                code: 200,
                message: "LOGIN SUCCESS",
                data: {
                    token: token,
                    user: user
                },
                error: []
            });
        }
    })
}

exports.user_login_email = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec().then(user => {
        if (!user) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "Username/Password Not Found!",
                data: [],
                error: []
            });
        }

        bcrypt.compare(req.body.password, user.password).then(function(resdata) {
            if (resdata) {
                const token = jwt.sign({
                        email: user.email,
                        userId: user._id
                    },
                    process.env.JWT_KEY, {
                        expiresIn: "96h"
                    }
                );
                return res.status(200).json({
                    status: "OK",
                    code: 200,
                    message: "LOGIN SUCCESS",
                    data: {
                        token: token,
                        user: user
                    },
                    error: []
                });
            } else {
                res.status(401).json({
                    status: "ERROR",
                    code: 401,
                    message: "Username/Password Not Found!",
                    data: [],
                    error: []
                });
            }
        });
    })
};

exports.user_update = (req, res, next) => {
    let id = req.body.id
    if (req.body._id) {
        id = req.body._id;
        delete req.body._id;
    }
    User.findById(id, function(err, thing) {
        if (err) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "User not found",
                data: [],
                error: err
            });
        }
        if (!thing) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "User not found",
                data: [],
                error: []
            });
        }
        var updated = _.assign(thing, req.body);
        if (!updated) {
            return res.status(401).json({
                status: "ERROR",
                code: 401,
                message: "User not found",
                data: [],
                error: []
            });
        }
        updated.save(function(err) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    return res.status(401).json({
                        status: "ERROR",
                        code: 401,
                        message: "Sequence type should be unique",
                        data: [],
                        error: []
                    });
                } else {
                    return res.status(401).json({
                        status: "ERROR",
                        code: 401,
                        message: "Error Occure",
                        data: [],
                        error: err
                    });
                }
            } else {
                return res.status(200).json({
                    status: "OK",
                    code: 200,
                    message: "User Updated",
                    data: [],
                    error: []
                });
            }
        });
    });
}

exports.getAllUSERDATA = (req, res, next) => {

    User.find({ userType: { $ne: 'Super-Admin' } }).populate({ path: 'companyID' }).exec().then(user => {
        if (user.length <= 0) {
            return res.status(400).json({
                status: "ERROR",
                code: 400,
                message: "User Not Found",
                data: [],
                error: []
            });
        }

        return res.status(200).json({
            status: "OK",
            code: 200,
            message: "User List Data",
            data: user,
            error: []
        });
    })
}

exports.getCompanyUsers = (req, res, next) => {

    User.find({ companyID: req.query.companyid }).exec().then(user => {
        if (user.length <= 0) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "User Not Found",
                data: [],
                error: []
            });
        }
        return res.status(200).json({
            status: "OK",
            code: 200,
            message: "User List Data",
            data: user,
            error: []
        });
    })
}

exports.getusercompany = (req, res, next) => {

    Company.find({ companyID: req.query.userid }).exec().then(user => {
        if (user.length <= 0) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "User Not Found",
                data: [],
                error: []
            });
        }

        return res.status(200).json({
            status: "OK",
            code: 200,
            message: "User List Data",
            data: user,
            error: []
        });
    })
}

exports.Single_user_details = (req, res, next) => {

    User.findOne({ _id: req.params.userId }).exec().then(user => {
        if (!user) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "User Not Found",
                data: [],
                error: []
            });
        }

        return res.status(200).json({
            status: "OK",
            code: 200,
            message: "User Details",
            data: user,
            error: []
        });
    })
};

exports.user_delete = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec().then(result => {
        res.status(200).json({
            status: "OK",
            code: 200,
            message: "User Deleted",
            data: [],
            error: []
        });
    })
};

exports.user_bulk_upload = (req, res, next) => {

    User.insertMany(req.body.userArray).then((result, err) => {
        if (result.length > 0) {
            res.status(200).json({
                status: "OK",
                code: 200,
                message: "User uploaded",
                data: result,
                error: []
            });
        } else {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "User upload failed",
                data: [],
                error: []
            });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

// exports.forgotPassword = (req, res, next) => {
//     User.findOne({ mobileNo: req.body.mobileNo }).exec().then(user => {

//             if (!user) {
//                 return res.status(401).json({
//                     status: "ERROR",
//                     code: 401,
//                     message: "User Not Exist!",
//                     data: [],
//                     error: []
//                 });
//             }

//             User.update({ mobileNo: req.body.mobileNo }, { $set: { resetRequest: true } })
//                 .exec()
//                 .then(result => {})
//                 .catch(err => {
//                     console.log(err);
//                 });
//             let name = user.lastName + ' ' + user.firstName;

//             // sendResetPasswordEmail(user.mobileNo, name, 'http://localhost:4200/#/reset-password?token=' + token);

//             return res.status(200).json({
//                 status: "OK",
//                 code: 200,
//                 message: "Forgot Password Success",
//                 data: [],
//                 error: []
//             });

//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// };

// exports.resetPassword = (req, res, next) => {

//     User.find({ email: req.userData.email })
//         .exec()
//         .then(user => {
//             if (user.length < 1) {
//                 return res.status(404).json({
//                     status: "ERROR",
//                     code: 404,
//                     message: "No Request Found!",
//                     data: [],
//                     error: []
//                 });
//             }


//             var bytes = CryptoJS.AES.decrypt(req.body.password.toString(), process.env.CRYPTO_ENCRYPT_KEY);
//             var decPassword = bytes.toString(CryptoJS.enc.Utf8);

//             if (decPassword.length <= 0) {
//                 return res.status(400).json({
//                     status: "ERROR",
//                     code: 400,
//                     message: "Format not valid",
//                     data: [],
//                     error: []
//                 });
//             }

//             bcrypt.hash(decPassword, 10, (err, hash) => {
//                 if (err) {
//                     return res.status(500).json({
//                         status: "ERROR",
//                         code: 500,
//                         message: "Internal Server Error",
//                         data: [],
//                         error: err
//                     });
//                 } else {
//                     User.update({ email: req.userData.email }, { $set: { resetRequest: false, resetToken: null, password: hash } })
//                         .exec()
//                         .then(result => {
//                             return res.status(200).json({
//                                 status: "OK",
//                                 code: 200,
//                                 message: "Password Reset Success",
//                                 data: [],
//                                 error: []
//                             });
//                         })
//                         .catch(err => {
//                             console.log(err);
//                         });
//                 }
//             });


//         });
// };

exports.changePassword = (req, res, next) => {

    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "User Not Found",
                data: [],
                error: []
            });
        }


        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(403).json({
                    status: "ERROR",
                    code: 403,
                    message: "Current Password is invalid",
                    data: [],
                    error: []
                });
            }

            if (result) {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: "ERROR",
                            code: 500,
                            message: "Internal Server Error",
                            data: [],
                            error: err
                        });
                    } else {
                        User.update({ email: req.body.email }, { $set: { password: hash } })
                            .exec()
                            .then(result => {
                                return res.status(200).json({
                                    status: "OK",
                                    code: 200,
                                    message: "Password Changed Success",
                                    data: [],
                                    error: []
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                });
            } else {
                res.status(403).json({
                    status: "ERROR",
                    code: 403,
                    message: "Current Password is invalid",
                    data: [],
                    error: []
                });
            }
        });
    });
};