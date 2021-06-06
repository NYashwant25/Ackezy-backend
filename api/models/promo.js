const mongoose = require('mongoose');

const companySchema = mongoose.Schema({

    name: { type: String },
    description: { type: String },
    code: { type: String },
    codeStart: { type: String },
    codeEnd: { type: String },
    discountType: { type: String },
    amount: { type: String },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },

});

module.exports = mongoose.model('Promo', companySchema);