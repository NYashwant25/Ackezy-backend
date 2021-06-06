const express = require("express");
const router = express.Router();

const DashboardController = require('../controllers/dashboard');
const checkAuth = require('../middleware/check-auth');

router.get("/count", DashboardController.Das_count);
router.post("/document/create", DashboardController.Create_Document);
router.post("/document/transaction", DashboardController.Get_Transaction);
router.post("/document/deliverer", DashboardController.Add_Deliverer);
router.post("/document/search", DashboardController.Search_document);
router.get("/document/getall", DashboardController.Get_document);
router.post("/subscription/search", DashboardController.Search_subscription);


module.exports = router;