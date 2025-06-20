import { IPriceInput } from '@noemdek/interfaces/price.interfaces';
import HTTP_STATUS from 'http-status-codes';
import { bulkPriceValidationSchema, priceValidationSchema } from '@noemdek/schemes/price-validation';
import { PriceService } from '@noemdek/services/price.services';
import { NextFunction, Request, Response } from 'express';
import { JoiRequestValidationError, NotFoundError } from '@noemdek/utils/helpers/error-handler';

const priceService = new PriceService();

export class PriceController {
  async createPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = priceValidationSchema.validate(req.body);
      if (error) throw new JoiRequestValidationError(error.details[0].message);

      const price = await priceService.createPrice({ ...req.body, uploadedBy: req.currentUser?.userId });
      res.status(HTTP_STATUS.CREATED).json(price);
    } catch (error) {
      next(error);
    }
  }

  async bulkCreatePrices(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = bulkPriceValidationSchema.validate(req.body);
      if (error) throw new JoiRequestValidationError(error.details[0].message);

      const prices = req.body.map((price: IPriceInput) => ({
        ...price,
        uploadedBy: req.currentUser?.userId,
      }));

      const createdPrices = await priceService.bulkCreatePrice(prices);
      res.status(HTTP_STATUS.CREATED).json(createdPrices);
    } catch (error) {
      next(error);
    }
  }

  async getPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const price = await priceService.getPriceById(req.params.id);
      if (!price) throw new NotFoundError('Price record not found');
      res.status(HTTP_STATUS.OK).json(price);
    } catch (error) {
      next(error);
    }
  }

  async getAllPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const prices = await priceService.getAllPrices(req.query);
      if (!prices.length) throw new NotFoundError('No price records found');
      res.status(HTTP_STATUS.OK).json(prices);
    } catch (error) {
      next(error);
    }
  }

  async updatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const price = await priceService.updatePrice(req.params.id, req.body);
      if (!price) throw new NotFoundError('Price record not found');
      res.status(HTTP_STATUS.OK).json(price);
    } catch (error) {
      next(error);
    }
  }

  async deletePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const price = await priceService.deletePrice(req.params.id);
      if (!price) throw new NotFoundError('Price record not found');
      res.status(HTTP_STATUS.OK).json({ message: 'Price deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getPriceAnalysis(_req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await priceService.getPriceAnalysis();
      if (!Object.keys(analysis).length) throw new NotFoundError('No price analysis data available');
      res.status(HTTP_STATUS.OK).json(analysis);
    } catch (error) {
      next(error);
    }
  }

  async getPricesWithFilters(req: Request, res: Response, next: NextFunction) {
    try {
      const prices = await priceService.getPricesWithFilters(req.query);
      if (!prices.length) throw new NotFoundError('No prices found matching your criteria');
      res.status(HTTP_STATUS.OK).json(prices);
    } catch (error) {
      next(error);
    }
  }
}
