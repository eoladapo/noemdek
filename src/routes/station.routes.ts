import { StationController } from '@noemdek/controllers/station.controller';
import { authMiddleware } from '@noemdek/utils/helpers/auth-middleware';
import { Router } from 'express';

const router = Router();

// const stationController = new StationController();

router.post('/', authMiddleware.checkAuthentication, StationController.prototype.createStation);
router.get('/', StationController.prototype.getAllStations);
router.get('/location', StationController.prototype.getStationsByLocation);
router.get('/:id', StationController.prototype.getStation);
router.put('/:id', authMiddleware.checkAuthentication, StationController.prototype.updateStation);
router.delete('/:id', authMiddleware.checkAuthentication, StationController.prototype.deleteStation);

export { router as stationRouter };
