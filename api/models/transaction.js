const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({

    code: { type: String },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    status: { type: String },

    delegate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    self: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    deliverer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Transaction', transactionSchema);