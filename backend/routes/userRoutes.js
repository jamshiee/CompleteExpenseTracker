import express from 'express'
import authMiddleware from '../middleware/authMidleware.js';
import { changePassword, getUser, updateUser } from '../controller/userController.js';

const router = express.Router()

router.get('/',authMiddleware,getUser)
router.put('/change-password',authMiddleware,changePassword)
router.put('/update',authMiddleware,updateUser)

export default router;