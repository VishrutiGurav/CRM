const { signup, login, adminLogin } = require('../Controllers/AuthController');
const { signupValidation, loginValidation, adminLoginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/admin', adminLoginValidation, adminLogin); 

module.exports = router;





