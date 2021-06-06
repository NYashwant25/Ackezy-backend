const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    userType: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String },
    mobileNo: { type: String },
    uniqueCode: { type: String },
    resetToken: { type: String },
    companyID: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', },
    profilePhoto: { type: String },
    registrationMobileOTP: { type: String },
    deviceToken: { type: String },
    otpcreated: { type: Number },
    isMobileVerified: { type: Boolean, default: false },
    registrationEmailOTP: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isBanUser: { type: Boolean, default: false },
    resetRequest: { type: Boolean, default: false },
    subscriptionStatus: { type: String },
    subscriptionID: { type: String },
    subscriptionStartDate: { type: Date, default: Date.now() },
    subscriptionEndDate: { type: Date, default: Date.now() },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },
    invitedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', }
});

module.exports = mongoose.model('User', userSchema);