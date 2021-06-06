const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({

    name: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() },

});

module.exports = mongoose.model('Type', typeSchema);