const mongoose = require('mongoose');

const sunscriptionSchema = mongoose.Schema({

    name: { type: String },
    description: { type: String },
    userType: { type: String },
    period: { type: String },
    amount: { type: String },
    totalUser: { type: String },
    totalTransaction: { type: String },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },

});

module.exports = mongoose.model('Subscription', sunscriptionSchema);