import  {Router}  from "express";
import { auth } from "../../middleware/Auth.js";
import * as messageController from "./controller/message.js";
const router = Router()

router.post('/:id',messageController.addMessage)
router.delete('/:id',auth(),messageController.deleteMessage)
router.get('/',auth(),messageController.getAllMessage)

export default router