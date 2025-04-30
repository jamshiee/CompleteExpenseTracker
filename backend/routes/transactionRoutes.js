import express from 'express';
import authMiddleware from '../middleware/authMidleware.js';
import { addTransaction, getDashboard, getTransactions, transferMoneyBwAccount, generateDummyData } from '../controller/transactionController.js';

const router = express.Router();

router.get('/',authMiddleware,getTransactions)
router.get('/dashboard',authMiddleware,getDashboard)
router.post('/add-transaction/:account_id',authMiddleware,addTransaction)
router.put('/transfer-money',authMiddleware,transferMoneyBwAccount)
router.post('/dummy-data',authMiddleware,generateDummyData)


export default router;