import HTTP_STATUS from 'http-status-codes';
import { stationValidationSchema } from '@noemdek/schemes/station-validation';
import { StationService } from '@noemdek/services/station.services';
import { NextFunction, Request, Response } from 'express';
import { JoiRequestValidationError, NotFoundError } from '@noemdek/utils/helpers/error-handler';

const stationService = new StationService();

export class StationController {
  async createStation(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = stationValidationSchema.validate(req.body);
      if (error) {
        throw new JoiRequestValidationError(error.details[0].message);
      }

      const station = await stationService.createStation(req.body);
      res.status(HTTP_STATUS.CREATED).json(station);
    } catch (error) {
      next(error);
    }
  }

  async getStation(req: Request, res: Response, next: NextFunction) {
    try {
      const station = await stationService.getStationById(req.params.id);
      if (!station) throw new NotFoundError('Station not found');
      res.status(HTTP_STATUS.OK).json(station);
    } catch (error) {
      next(error);
    }
  }

  async getAllStations(req: Request, res: Response, next: NextFunction) {
    try {
      const stations = await stationService.getAllStations(req.query);
      if (!stations.length) throw new NotFoundError('No stations found');
      res.status(HTTP_STATUS.OK).json(stations);
    } catch (error) {
      next(error);
    }
  }

  async updateStation(req: Request, res: Response, next: NextFunction) {
    try {
      const station = await stationService.updateStation(req.params.id, req.body);
      if (!station) {
        throw new NotFoundError('Station not found');
      }

      res.status(HTTP_STATUS.OK).json(station);
    } catch (error) {
      next(error);
    }
  }

  async deleteStation(req: Request, res: Response, next: NextFunction) {
    try {
      const station = await stationService.deleteStation(req.params.id);

      if (!station) throw new NotFoundError('Station not found');

      res.status(HTTP_STATUS.OK).json({ message: 'Station deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getStationsByLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { state, region, lga, city } = req.body;

      const stations = await stationService.getStationsByLocation({
        state,
        region,
        lga,
        city,
      });

      if (!stations.length) throw new NotFoundError('No stations found in this location');

      res.status(HTTP_STATUS.OK).json(stations);
    } catch (error) {
      next(error);
    }
  }
}
