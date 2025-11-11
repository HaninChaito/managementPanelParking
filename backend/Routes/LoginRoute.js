import express from 'express'
import { login , CreateAccount , setPassword , sendEmail } from '../Controllers/Login.js';


const router = express.Router();



router.post('/login' , login);
router.post('/CreateAccount', CreateAccount);
router.post('/send-email', sendEmail);
router.post('/set-password', setPassword);



export default router ; 