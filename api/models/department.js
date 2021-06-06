const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({

    name: { type: String },
    description: { type: String },
    companyName: { type: String },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', },
    IsActive: { type: Boolean, default: true },
    createdDate: { type: Date, default: Date.now() },
    lastUpdatedDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Department', departmentSchema);