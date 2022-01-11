const router = require("express").Router()
const { getMe, getByParam, deleteMe } = require('../controllers/user');


router.get('/', getMe);
router.get('/:id', getByParam);
router.delete('/', deleteMe);

module.exports = router;