const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('If you\'re reading this, you\'ve successfully brought the Subscription.');
});


module.exports = router;