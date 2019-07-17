const express = require('express');
const router = express.Router();

const controllerUser = require("../controllers/userController");

router.post('/register', controllerUser.register);
router.post('/sign_in', controllerUser.sign_in);


module.exports = router;