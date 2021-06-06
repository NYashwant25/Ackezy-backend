const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const fs = require('fs');
const _ = require('lodash');
const User = require("../models/user");
const Transaction = require("../models/transaction");

exports.get = (req, res, next) => {
    var Model = '';
    if (req.params.collection == 'Category') {
        Model = require("../models/category");
    }
    if (req.params.collection == 'User') {
        Model = require("../models/user");
    }
    if (req.params.collection == 'Company') {
        Model = require("../models/company");
    }
    if (req.params.collection == 'Department') {
        Model = require("../models/department");
    }
    if (req.params.collection == 'Subscription') {
        Model = require("../models/subscription");
    }
    if (req.params.collection == 'Document') {
        Model = require("../models/document");
    }
    if (req.params.collection == 'Promo') {
        Model = require("../models/promo");
    }
    if (req.params.collection == 'Type') {
        Model = require("../models/type");
    }
    if (req.params.collection == 'SubscriptionDetails') {
        Model = require("../models/subscriptionDetails");
    }
    Model.find({}, function(err, annos) {
        if (err) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "Data Not Found",
                data: [],
                error: err
            });
        } else {
            return res.status(200).json({
                status: "Fetch All Data",
                code: 200,
                message: `Data Fetch Successfully`,
                data: annos,
                error: []
            });
        }
    })
}

exports.getById = (req, res, next) => {
    var Model = '';
    if (req.params.collection == 'Category') {
        Model = require("../models/category");
    }
    if (req.params.collection == 'User') {
        Model = require("../models/user");
    }
    if (req.params.collection == 'Company') {
        Model = require("../models/company");
    }
    if (req.params.collection == 'Department') {
        Model = require("../models/department");
    }
    if (req.params.collection == 'Subscription') {
        Model = require("../models/subscription");
    }
    if (req.params.collection == 'Document') {
        Model = require("../models/document");
    }
    if (req.params.collection == 'Promo') {
        Model = require("../models/promo");
    }
    if (req.params.collection == 'Type') {
        Model = require("../models/type");
    }
    if (req.params.collection == 'SubscriptionDetails') {
        Model = require("../models/subscriptionDetails");
    }
    Model.findOne({ _id: req.params.id }, function(err, annos) {
        if (err) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: "Data Not Found",
                data: [],
                error: err
            });
        } else {
            return res.status(200).json({
                status: "Fetch Single Data",
                code: 200,
                message: `Data Fetch Successfully`,
                data: annos,
                error: []
            });
        }
    })
}

exports.createnew = (req, res, next) => {
    var Model = '';
    if (req.params.collection == 'Category') {
        Model = require("../models/category");
    }
    if (req.params.collection == 'User') {
        Model = require("../models/user");
    }
    if (req.params.collection == 'Company') {
        Model = require("../models/company");
    }
    if (req.params.collection == 'Department') {
        Model = require("../models/department");
    }
    if (req.params.collection == 'Subscription') {
        Model = require("../models/subscription");
    }
    if (req.params.collection == 'Document') {
        Model = require("../models/document");
    }
    if (req.params.collection == 'Promo') {
        Model = require("../models/promo");
    }
    if (req.params.collection == 'Type') {
        Model = require("../models/type");
    }
    if (req.params.collection == 'SubscriptionDetails') {
        Model = require("../models/subscriptionDetails");
    }
    var data = new Model(req.body);
    Model.create(data, function(err, mod) {
        if (err) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        } else {
            if (req.params.collection == 'Document') {
                var newtrans = new Transaction({
                    code: req.body.code ? req.body.code : null,
                    fromUser: req.body.fromUser,
                    toUser: req.body.toUser,
                    companyId: req.body.companyId,
                    documentId: mod._id,
                    status: "Initiated",
                    createdDate: new Date().getTime(),
                    lastUpdatedDate: new Date().getTime()
                });

                Transaction.create(newtrans, function(err, receiver) {
                    return res.status(200).json({
                        status: "Created",
                        code: 200,
                        message: req.params.collection + ` Created Successfully`,
                        data: mod,
                        error: []
                    });
                });
            } else {
                return res.status(200).json({
                    status: "Created",
                    code: 200,
                    message: req.params.collection + ` Created Successfully`,
                    data: mod,
                    error: []
                });

            }
        }
    })
}

exports.update = (req, res, next) => {
    var Model = '';
    if (req.params.collection == 'Category') {
        Model = require("../models/category");
    }
    if (req.params.collection == 'User') {
        Model = require("../models/user");
    }
    if (req.params.collection == 'Company') {
        Model = require("../models/company");
    }
    if (req.params.collection == 'Department') {
        Model = require("../models/department");
    }
    if (req.params.collection == 'Subscription') {
        Model = require("../models/subscription");
    }
    if (req.params.collection == 'Document') {
        Model = require("../models/document");
    }
    if (req.params.collection == 'Promo') {
        Model = require("../models/promo");
    }
    if (req.params.collection == 'Type') {
        Model = require("../models/type");
    }
    if (req.params.collection == 'SubscriptionDetails') {
        Model = require("../models/subscriptionDetails");
    }
    var id = req.params.id;
    if (!id) {
        id = req.body._id;
    }
    if (req.body._id) {
        delete req.body._id;
    }
    Model.findById(id, function(err, thing) {
        if (err) {
            return res.status(400).json({
                status: "ERROR",
                code: 400,
                message: `Not Found`,
                data: [],
                error: err
            });
        }
        if (!thing) {
            return res.status(400).json({
                status: "ERROR",
                code: 400,
                message: `Not Found`,
                data: [],
                error: err
            });
        }
        var updated = _.assign(thing, req.body);
        if (!updated) {
            return res.status(400).json({
                status: "ERROR",
                code: 400,
                message: `Not Found`,
                data: [],
                error: err
            });
        }
        updated.save(function(err) {
            if (err) {
                return res.status(400).json({
                    status: "ERROR",
                    code: 400,
                    message: `Sequence type should be unique"`,
                    data: [],
                    error: err
                });

            } else {

                return res.status(200).json({
                    status: 'Updated',
                    code: 200,
                    message: req.params.collection + ` Updated Successfully`,
                    data: thing,
                    error: []
                });
            }
        })
    });
}


exports.server_side_pagination = (req, res, next) => {

    const Model = req.params.collection;
    let data = req.body;

    var where_cond = req.body.where_cond;

    var query = Model.find(where_cond);

    query = query.sort({ create_date: -1 });

    query = query.skip(req.body.skip).limit(req.body.limit).exec(function(err, annos) {
        if (err !== null) {
            return res.status(400).json({
                status: "ERROR",
                code: 400,
                message: err,
                data: [],
                error: err
            });
        } else {
            Model.find(where_cond).count().exec(function(er_, cnt) {
                if (er_) {
                    reject(err);
                } else {
                    var temp = {
                        recordsTotal: cnt,
                        data: annos,
                        recordsFiltered: cnt
                    }
                    return res.status(200).json({
                        status: 'Updated',
                        code: 200,
                        message: `Server Side Pagination`,
                        data: annos,
                        error: []
                    });
                }
            })
        }
    })
};

exports.bulk_insert = (req, res, next) => {
    let body = req.body;
    if (!body.data) {
        return res.status(400).json({
            status: "ERROR",
            code: 400,
            message: 'Bad Request',
            data: [],
            error: 'Bad Request'
        });
    }

    if (!(body.data.constructor === Array)) {
        return res.status(400).json({
            status: "ERROR",
            code: 400,
            message: 'Please Send Array',
            data: [],
            error: 'Please Send Array'
        });
    }
    var inserted_objs = [];
    const Model = req.params.collection;

    async.eachSeries(body.data, function(item, cb) {
        var dataa = new Model(item);
        Model.create(dataa, function(err, mod) {
            if (err) {
                console.log(err);
            } else {
                inserted_objs.push(mod);
            }
            cb(null);
        });
    }, function() {
        return res.status(200).json({
            status: 'Bulk Inserted',
            code: 200,
            message: `Bulk Inserted Successfully`,
            data: inserted_objs,
            error: []
        });
    })
}


exports.doc_transfer = (req, res, next) => {
    var Doc = require("../models/document");
    var data = new Model(req.body);
    Doc.create(data, function(err, mod) {
        if (err) {
            return res.status(404).json({
                status: "ERROR",
                code: 404,
                message: err.errmsg,
                data: [],
                error: err.errmsg
            });
        } else {
            return res.status(200).json({
                status: "Created",
                code: 200,
                message: `Document Created Successfully`,
                data: mod,
                error: []
            });
        }
    })
}

exports.destroy = (req, res, next) => {
    var Model = '';
    if (req.params.collection == 'Category') {
        Model = require("../models/category");
    }
    if (req.params.collection == 'User') {
        Model = require("../models/user");
    }
    if (req.params.collection == 'Company') {
        Model = require("../models/company");
    }
    if (req.params.collection == 'Department') {
        Model = require("../models/department");
    }
    if (req.params.collection == 'Subscription') {
        Model = require("../models/subscription");
    }
    if (req.params.collection == 'Document') {
        Model = require("../models/document");
    }
    if (req.params.collection == 'Promo') {
        Model = require("../models/promo");
    }
    if (req.params.collection == 'Type') {
        Model = require("../models/type");
    }
    if (req.params.collection == 'SubscriptionDetails') {
        Model = require("../models/subscriptionDetails");
    }
    Model.deleteOne({ _id: req.params.id }).exec().then(result => {
        res.status(200).json({
            status: "OK",
            code: 200,
            message: req.params.collection + ` Deleted Successfully`,
            data: [],
            error: []
        });
    })
};