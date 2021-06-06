const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({

    name: { type: String },

    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },

    status: { type: String },
    number: { type: String },
    address: { type: String },
    phone: { type: String },
    categoryName: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Document', documentSchema);