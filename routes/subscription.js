const router = require('express').Router();
const { subscribe, plans, webhook, portal } = require('../controllers/subscription');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', isAuthenticated, plans);
router.post('/', isAuthenticated, subscribe);
router.post('/webhook', webhook);
router.get('/manage', isAuthenticated, portal);

module.exports = router;