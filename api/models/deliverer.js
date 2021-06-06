 const mongoose = require('mongoose');

 const receiverSchema = mongoose.Schema({

     companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

     documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },

     delegate: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     }],

     tag: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     }],

     deliverer: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     }],

     subReceiver: {
         name: { type: String },
         mobile: { type: String }
     },
     self: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

     createdDate: { type: Date, default: Date.now() },
     lastUpdatedDate: { type: Date, default: Date.now() }
 });

 module.exports = mongoose.model('Receiver', receiverSchema);