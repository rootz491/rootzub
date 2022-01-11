const router = require("express").Router();
const { signup, signin, refresh } = require('../controllers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh', refresh);

module.exports = router;