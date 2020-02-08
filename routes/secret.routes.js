const express = require('express');
const router = express.Router();

const routeGuard = require('../configs/route-guard.config');

/* GET home page */
router.get('/secret', routeGuard, (req, res, next) => res.render('auth-views/secrets'));

module.exports = router;
