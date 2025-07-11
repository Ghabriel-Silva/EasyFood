const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');
const session = require('express-session');

 router.get('/login', (req, res)=>{
    res.render('login')
 })

 router.post('/login', authController.login)
 router.get('/logout', authController.logout)


 module.exports = router;