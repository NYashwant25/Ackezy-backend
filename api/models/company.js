const mongoose = require('mongoose');

const companySchema = mongoose.Schema({

    name: { type: String },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },

    //SubSciption Fields

    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionDetails', },
    subscriptionStatus: { type: String },
    subscriptionStart: { type: Date, default: Date.now() },
    subscriptionEnd: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('Company', companySchema);