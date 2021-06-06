const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    name: { type: String },
    description: { type: String },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Category', categorySchema);