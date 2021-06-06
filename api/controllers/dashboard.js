const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const fs = require('fs');
const _ = require('lodash');
const User = require("../models/user");
const Company = require("../models/company");
const Department = require("../models/department");
const Document = require("../models/document");
const Transaction = require("../models/transaction");
const Receiver = require("../models/deliverer");
const Subscription = require("../models/subscription");

exports.Das_count = (req, res, next) => {

    try {
        User.countDocuments({ isBanUser: false }).exec(function(err, userCount) {
            Company.countDocuments({}).exec(function(err, companyCount) {
                Department.countDocuments({}).exec(function(err, departCount) {
                    Document.countDocuments({}).exec(function(err, docCount) {
                        User.countDocuments({ userType: 'Non-Corporate-User' }).exec(function(err, noncorpouserCount) {
                            User.countDocuments({ userType: 'Corporate-User' }).exec(function(err, corpouserCount) {

                                let data = {
                                    userCount,
                                    departCount,
                                    docCount,
                                    noncorpouserCount,
                                    corpouserCount,
                                    companyCount
                                }

                                res.status(200).json({
                                    status: "Fetch Count",
                                    code: 200,
                                    message: "Dashboard Count Fetched",
                                    data: data,
                                    error: []
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (e) {
        res.status(500).json({
            status: "ERROR",
            code: 500,
            message: "Internal Server Error",
            data: [],
            error: err
        });
    }
}

exports.Create_Document = (req, res, next) => {

    var newdoc = new Document({
        name: req.body.name,
        fromUser: req.body.fromUser,
        toUser: req.body.toUser,
        companyId: req.body.companyId,
        typeId: req.body.typeId,
        status: req.body.status ? req.body.status : "Initiated",
        number: req.body.number ? req.body.number : null,
        address: req.body.address ? req.body.address : null,
        phone: req.body.phone ? req.body.phone : null,
        createdDate: new Date(),
        lastUpdatedDate: new Date()
    });

    Document.create(newdoc, function(err, mod) {
        if (err) {
            res.status(400).json({
                status: "ERROR",
                code: 400,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        } else {

            var newrec = new Receiver({
                companyId: req.body.companyId,
                documentId: mod._id,
                delegate: req.body.delegate ? [req.body.delegate] : [],
                self: req.body.self ? [req.body.self] : [],
                tag: req.body.tag ? [req.body.tag] : [],
                deliverer: req.body.deliverer ? [req.body.deliverer] : [],
                createdDate: new Date(),
                lastUpdatedDate: new Date()
            });

            Receiver.create(newrec, function(err, receiver) {
                if (err) {
                    res.status(400).json({
                        status: "ERROR",
                        code: 400,
                        message: err.errmsg,
                        data: [],
                        error: err.errmsg
                    });
                } else {

                    var newtrans = new Transaction({
                        code: req.body.code,
                        fromUser: req.body.fromUser,
                        toUser: req.body.toUser,
                        companyId: req.body.companyId,
                        documentId: mod._id,
                        status: "Initiated",
                        delegate: req.body.delegate ? req.body.delegate : '',
                        self: req.body.self ? req.body.self : '',
                        tag: req.body.tag ? req.body.tag : '',
                        deliverer: req.body.deliverer ? req.body.deliverer : '',
                        createdDate: new Date(),
                        lastUpdatedDate: new Date()
                    });

                    Transaction.create(newtrans, function(err, receiver) {
                        if (err) {
                            res.status(400).json({
                                status: "ERROR",
                                code: 400,
                                message: err.errmsg,
                                data: [],
                                error: err.errmsg
                            });
                        } else {

                            res.status(200).json({
                                status: "Created",
                                code: 200,
                                message: 'Document Created Successfully',
                                data: mod,
                                error: []
                            });
                        }
                    });
                }
            });
        }
    })
}


exports.Get_Transaction = (req, res, next) => {

    let mongoQuery = {};
    let query = req.body;

    for (var key in query) {
        if (key == "companyId") {
            mongoQuery['companyId'] = query[key];
        } else if (key == "fromUser") {
            mongoQuery['$or'] = [
                { fromUser: req.body.fromUser }, { toUser: req.body.fromUser }
            ]
        }
    }

    Transaction.find(mongoQuery, function(err, receiver) {
        if (err) {
            res.status(400).json({
                status: "ERROR",
                code: 400,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        } else {

            res.status(200).json({
                status: "Created",
                code: 200,
                message: 'Transaction Data',
                data: receiver,
                error: []
            });
        }
    });
}

exports.Add_Deliverer = (req, res, next) => {
    Receiver.findOne({ companyId: req.body.companyId, documentId: req.body.documentId }, function(err, receiver) {
        if (err) {
            res.status(400).json({
                status: "ERROR",
                code: 400,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        }

        if (!receiver || receiver == null) {

            var newrec = new Receiver({
                companyId: req.body.companyId,
                documentId: req.body.documentId,
                deliverer: req.body.deliverer ? [req.body.deliverer] : [],
                delegate: req.body.delegate ? [req.body.delegate] : [],
                tag: req.body.tag ? [req.body.tag] : [],
                createdDate: new Date(),
                lastUpdatedDate: new Date()
            });

            if (req.body.self) {
                newrec.self = req.body.self;
            }

            Receiver.create(newrec, function(err, receiver) {

                var newtrans = new Transaction({
                    code: req.body.code ? req.body.code : null,
                    fromUser: req.body.fromUser,
                    toUser: req.body.toUser,
                    companyId: req.body.companyId,
                    documentId: req.body.documentId,
                    delegate: req.body.delegate ? req.body.delegate : null,
                    self: req.body.self ? req.body.self : null,
                    tag: req.body.tag ? req.body.tag : null,
                    deliverer: req.body.deliverer ? req.body.deliverer : null,
                    createdDate: new Date(),
                    lastUpdatedDate: new Date()
                });

                if (req.body.deliverer) {
                    newtrans.status = "Deliverer Added"
                }
                if (req.body.delegate) {
                    newtrans.status = "Delegate Added"
                }
                if (req.body.tag) {
                    newtrans.status = "Tag Added"
                }

                Transaction.create(newtrans, function(err, transaction) {
                    if (err) {
                        res.status(400).json({
                            status: "ERROR",
                            code: 400,
                            message: err.errmsg,
                            data: [],
                            error: err.errmsg
                        });
                    } else {
                        Document.updateOne({ _id: req.body.documentId }, { $set: { status: 'On The Way' } }).exec().then(result => {
                            res.status(200).json({
                                status: "Created",
                                code: 200,
                                message: newtrans.status + ' Successfully',
                                data: transaction,
                                error: []
                            })
                        });
                    }
                });
            })
        } else {
            console.log("when FOUND")
            if (req.body.deliverer) {
                if (receiver.deliverer && receiver.deliverer.length > 0) {
                    var bnghr = (receiver.deliverer).toString()
                    var idx = bnghr.indexOf(req.body.deliverer);
                    if (idx < 0) {
                        receiver.deliverer.push(req.body.deliverer);
                    }
                } else {
                    receiver.deliverer = [];
                    receiver.deliverer.push(req.body.deliverer);
                }
            }

            if (req.body.delegate) {
                if (receiver.delegate && receiver.delegate.length > 0) {
                    var bnghr = (receiver.delegate).toString()
                    var idx = bnghr.indexOf(req.body.delegate);
                    if (idx < 0) {
                        receiver.delegate.push(req.body.delegate);
                    }
                } else {
                    receiver.delegate = [];
                    receiver.delegate.push(req.body.delegate);
                }
            }

            if (req.body.tag) {
                if (receiver.tag && receiver.tag.length > 0) {
                    var bnghr = (receiver.tag).toString()
                    var idx = bnghr.indexOf(req.body.tag);
                    if (idx < 0) {
                        receiver.tag.push(req.body.tag);
                    }
                } else {
                    receiver.tag = [];
                    receiver.tag.push(req.body.tag);
                }
            }
            receiver.save();

            var newtrans = new Transaction({
                code: req.body.code,
                fromUser: req.body.fromUser,
                toUser: req.body.toUser,
                // status: "Deliverer Added",
                companyId: req.body.companyId,
                documentId: req.body.documentId,
                delegate: req.body.delegate ? req.body.delegate : null,
                self: req.body.self ? req.body.self : null,
                tag: req.body.tag ? req.body.tag : null,
                deliverer: req.body.deliverer ? req.body.deliverer : null,
                createdDate: new Date(),
                lastUpdatedDate: new Date()
            });

            if (req.body.deliverer) {
                newtrans.status = "Deliverer Added"
            }
            if (req.body.delegate) {
                newtrans.status = "Delegate Added"
            }
            if (req.body.tag) {
                newtrans.status = "Tag Added"
            }

            Transaction.create(newtrans, function(err, Transa) {
                if (err) {
                    res.status(400).json({
                        status: "ERROR",
                        code: 400,
                        message: err.errmsg,
                        data: [],
                        error: err.errmsg
                    });
                } else {
                    Document.updateOne({ _id: req.body.documentId }, { $set: { status: 'On The Way' } }).exec().then(result => {
                        res.status(200).json({
                            status: "Created",
                            code: 200,
                            message: newtrans.status + ' Successfully',
                            data: receiver,
                            error: []
                        });
                    });
                }
            });
        }
    });
}


exports.Add_Subreceiver = (req, res, next) => {
    Receiver.findOne({ companyId: req.body.companyId, documentId: req.body.documentId }, function(err, receiver) {
        if (err) {
            res.status(400).json({
                status: "ERROR",
                code: 400,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        } else {
            receiver.subReceiver.name = req.body.name;
            receiver.subReceiver.mobile = req.body.mobile;
            receiver.save();
            Document.findOne({ _id: req.body.documentId }, function(err, mod) {
                if (err) {
                    res.status(400).json({
                        status: "ERROR",
                        code: 400,
                        message: err.errmsg,
                        data: [],
                        error: err.errmsg
                    });
                } else {
                    mod.status = 'Received';
                    mod.save();
                    var newtrans = new Transaction({
                        code: req.body.code,
                        fromUser: req.body.fromUser,
                        toUser: req.body.toUser,
                        companyId: req.body.companyId,
                        status: "Received",
                        documentId: req.body.documentId,
                        delegate: req.body.delegate ? req.body.delegate : '',
                        self: req.body.self ? req.body.self : '',
                        tag: req.body.tag ? req.body.tag : '',
                        deliverer: req.body.deliverer ? req.body.deliverer : '',
                        createdDate: new Date(),
                        lastUpdatedDate: new Date()
                    });

                    Transaction.create(newtrans, function(err, receiver) {
                        if (err) {
                            res.status(400).json({
                                status: "ERROR",
                                code: 400,
                                message: err.errmsg,
                                data: [],
                                error: err.errmsg
                            });
                        } else {
                            res.status(200).json({
                                status: "Created",
                                code: 200,
                                message: 'Document Received Successfully',
                                data: mod,
                                error: []
                            });
                        }
                    });
                }
            })
        }
    });
}

exports.Search_document = (req, res, next) => {

    let mongoQuery = {};
    let query = req.body;
    for (var key in query) {
        if (key == "name") {
            var re = new RegExp(query[key], 'i');
            mongoQuery['name'] = { "$in": [re] };
        } else if (key == "category") {
            mongoQuery['categoryId'] = { "$in": [query[key]] };
        } else if (key == "type") {
            mongoQuery['typeId'] = { "$in": [query[key]] };
        } else if (key == "number") {
            mongoQuery['number'] = { "$in": [query[key]] };
        } else if (key == "fromDate") {
            mongoQuery['$and'] = [
                { 'createdDate': { "$gte": new Date(req.body.fromDate), $lt: new Date(req.body.toDate) } }
            ]
        }
    }

    Document.find(mongoQuery).populate({ path: 'fromUser' }).populate({ path: 'toUser' }).populate({ path: 'typeId' }).populate({ path: 'companyId' }).exec().then(mod => {
        res.status(200).json({
            status: "Created",
            code: 200,
            message: 'Search Data',
            data: mod,
            error: []
        });

    });
}


exports.Search_subscription = (req, res, next) => {

    let mongoQuery = {};
    let query = req.body;
    for (var key in query) {
        if (key == "name") {
            var re = new RegExp(query[key], 'i');
            mongoQuery['name'] = { "$in": [re] };
        } else if (key == "category") {
            mongoQuery['categoryId'] = { "$in": [query[key]] };
        } else if (key == "type") {
            mongoQuery['typeId'] = { "$in": [query[key]] };
        } else if (key == "number") {
            mongoQuery['number'] = { "$in": [query[key]] };
        } else if (key == "fromDate") {
            mongoQuery['$and'] = [
                { 'createdDate': { "$gte": new Date(req.body.fromDate), $lt: new Date(req.body.toDate) } }
            ]
        }
    }

    // Subscription.find({ $and: [{ createdDate: { $gte: new Date(req.body.fromDate), $lt: new Date(req.body.toDate) } }, mongoQuery] }).populate({ path: 'fromUser' }).populate({ path: 'toUser' }).populate({ path: 'typeId' }).populate({ path: 'companyId' }).exec().then(mod => {
    Subscription.find(mongoQuery).populate({ path: 'fromUser' }).populate({ path: 'toUser' }).populate({ path: 'typeId' }).populate({ path: 'companyId' }).exec().then(mod => {
        res.status(200).json({
            status: "Created",
            code: 200,
            message: 'Search Data',
            data: mod,
            error: []
        });

    });
}


exports.Get_document = (req, res, next) => {
    Document.find({}).populate({ path: 'fromUser' }).populate({ path: 'toUser' }).populate({ path: 'typeId' }).populate({ path: 'companyId' }).exec().then(mod => {
        res.status(200).json({
            status: "Created",
            code: 200,
            message: 'Search Data',
            data: mod,
            error: []
        });

    });
}