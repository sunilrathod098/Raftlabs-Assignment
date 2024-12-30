import { Router } from 'express';
import { loginUser, registerUser } from '../src1/constroller.js';
import {deleteUser, getAllUser, getUserById, updateUser, userSearch} from '../src1/crud.controller.js';
// import { loginUser, registerUser } from '../src/constroller/user.controller.js';
// import { deleteUser, getAllUser, getUserById, updateUser, userSearch } from '../src/constroller/user.controller.js';

const router = Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/getalluser').get(getAllUser);
router.route('/userId/:_id').get(getUserById);
router.route('/update/:_id').patch(updateUser);
router.route('/delete/:_id').delete(deleteUser);
router.route('/search').get(userSearch)

export default router;