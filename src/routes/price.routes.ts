import { PriceController } from '@noemdek/controllers/price.controller';
import { authMiddleware } from '@noemdek/utils/helpers/auth-middleware';
import { Router } from 'express';

const router = Router();

router.post('/', authMiddleware.checkAuthentication, PriceController.prototype.createPrice);
router.post('/bulk', authMiddleware.checkAuthentication, PriceController.prototype.bulkCreatePrices);
router.get('/', PriceController.prototype.getAllPrices);
router.get('/analysis', authMiddleware.checkAuthentication, PriceController.prototype.getPriceAnalysis);
router.get('/filter', PriceController.prototype.getPricesWithFilters);
router.get('/:id', PriceController.prototype.getPrice);
router.put('/:id', authMiddleware.checkAuthentication, PriceController.prototype.updatePrice);
router.delete('/:id', authMiddleware.checkAuthentication, PriceController.prototype.deletePrice);

export { router as priceRouter };
