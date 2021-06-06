const express = require("express");
const router = express.Router();

const CommonController = require('../controllers/common');
const checkAuth = require('../middleware/check-auth');

router.get('/:collection', CommonController.get);
router.get('/:collection/:id', CommonController.getById);
router.post('/:collection/:id', CommonController.update);
router.post('/:collection', CommonController.update);
router.put('/:collection', CommonController.createnew);
router.delete('/:collection/:id', CommonController.destroy);
// router.delete('/soft/:collection/:id', CommonController.softdestroy);
// router.post('/execute/conditions/:collection', CommonController.executeQuery);
// // router.get('/metadata/info/:collection/:type', CommonController.metadata);
router.put('/bulk/insert/:collection', CommonController.bulk_insert);
router.post('/server/page/:collection', CommonController.server_side_pagination);
router.post('/transfer/doc', CommonController.doc_transfer);

module.exports = router;


module.exports = router;