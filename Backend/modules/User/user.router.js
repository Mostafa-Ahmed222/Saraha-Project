import  {Router}  from "express";
import { auth } from "../../middleware/Auth.js";
import * as userController from "./controller/user.js";
const router = Router()

router.patch('/signout',auth(),userController.signout)
router.put('/profile',auth(),userController.updateProfile)
router.delete('/profile',auth(),userController.deleteProfile)
router.get('/',userController.Allusers)
router.get('/profile',auth(),userController.userProfile)
router.post('/profile',auth(),userController.softDelete)
router.get('/trash',userController.userTrash)
router.get('/profile/:id',userController.shareProfile)
router.post('/profile/resetpassword', auth(), userController.resetPassword)
export default router