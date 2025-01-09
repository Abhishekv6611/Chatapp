import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getMessages, GetUserForSidebar, sendMessage } from '../controllers/message.controller.js'

const router=express.Router()

router.get("/users",protectRoute,GetUserForSidebar)
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessage)
export default router