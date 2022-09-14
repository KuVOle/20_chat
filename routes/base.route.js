const { Router } = require('express');
const BaseController = require('../controllers/base.controller');

const router = Router();

router.get('/', BaseController.get);

router.get('/registration', BaseController.registration);
router.post('/registration', BaseController.registration.bind(BaseController));

router.get('/activate/:token', BaseController.activate.bind(BaseController));

router.get('/login', BaseController.login);
router.post('/login', BaseController.login.bind(BaseController));

router.get('/forgot-password', BaseController.forgot);
router.post('/forgot-password', BaseController.forgot.bind(BaseController));

router.get('/restore/:token', BaseController.getRestore.bind(BaseController));
router.post('/restore/:token', BaseController.getRestore.bind(BaseController));


module.exports = router;