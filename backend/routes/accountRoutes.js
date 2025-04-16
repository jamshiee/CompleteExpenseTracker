import express from 'express';
import { addMoney, createAccount, getAccounts } from '../controller/accountController.js';
import authMiddleware from '../middleware/authMidleware.js';

const router = express.Router();

router.get('/',authMiddleware,getAccounts);
router.post('/create',authMiddleware,createAccount);
router.put('/add-money/:id',authMiddleware,addMoney)


export default router;