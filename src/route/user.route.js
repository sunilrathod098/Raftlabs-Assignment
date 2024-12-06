import { Router } from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser,
    registerUser,
    updateUser
} from '../controller/user.controller.js';

const router = Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/allusers').get(getAllUsers);
router.route('/userId/:_id').get(getUserById);
router.route('/update/:_id').put(updateUser);
router.route('/delete/:_id').delete(deleteUser)

export default router;