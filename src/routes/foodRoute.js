import express from 'express';
import * as controller from '../controllers/foodController.js';

const router = express.Router();

router.post('/foods', controller.create);
router.get('/foods', controller.getAll);
router.get('/foods/:id', controller.getById);
router.put('/foods/:id', controller.update);
router.delete('/foods/:id', controller.remove);
export default router;
