const { addQuery, getQueries, searchQuery, getCurrentAdminQueries, getSlots, resolveQuery, getCurrentCustomerQueries } = require('../controller/queryController');

const router = require('express').Router();
router.post('/addquery',addQuery)
router.post('/getallqueries',getQueries)
router.post('/search',searchQuery)
router.post('/getslots',getSlots)
router.post('/adminqueries',getCurrentAdminQueries)
router.post('/resolvequeries',resolveQuery)
router.post('/customerqueries',getCurrentCustomerQueries)

module.exports = router;