import { Router } from 'express'
import verifyToken from '../middlewares/verifyToken'
import { addCategory, getCategory, getCategoryById } from '../controllers/category.controllers'
import { verifyRole } from '../middlewares'

const router = Router()

router.route('/').post(verifyToken, verifyRole('admin', 'writer'), addCategory).get(getCategory)
router.route('/:id').get(getCategoryById)

export default router
