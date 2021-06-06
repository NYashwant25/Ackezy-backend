const express = require("express");
const router = express.Router();

const CompanyController = require('../controllers/company');
const checkAuth = require('../middleware/check-auth');

router.post("/department", CompanyController.getCompanyDepartment);
router.get("/getType", CompanyController.get_Type);
router.post("/subscribe", CompanyController.subscribe_company);
router.get("/already/subscribe", CompanyController.subscribed_com);


module.exports = router;