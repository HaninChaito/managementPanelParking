import express from 'express'
import  addManager from '../Controllers/managerController.js';
import verifyUser from '../middlewares/VerifyUser.js';

const router = express.Router();

router.post('/add',verifyUser,addManager);

export default router ; 
