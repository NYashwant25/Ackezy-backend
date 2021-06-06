const mongoose = require('mongoose');

const SubscriptionDetailSchema = mongoose.Schema({

    // userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    subscriptionstartDate: { type: Date },
    subscriptionendDate: { type: Date },
    amount: { type: String },
    Period: { type: String },
    transactionId: { type: String },
    transactionStatus: { type: String },
    paymentType: { type: String },
    referenceCode: { type: String },
    description: { type: String },
    cardNumber: { type: String },
    cardName: { type: String },
    cardType: { type: String },
    cardexpiredate: { type: Date },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('SubscriptionDetails', SubscriptionDetailSchema);