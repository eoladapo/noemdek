import { IPrice, IPriceAnalysis, IPriceInput, ProductType } from '@noemdek/interfaces/price.interfaces';
import { PriceModel } from '@noemdek/models/price.schema';
import { FilterQuery, PipelineStage, Types } from 'mongoose';

export class PriceService {
  async createPrice(priceData: IPriceInput & { uploadedBy: string }): Promise<IPrice> {
    return await PriceModel.create(priceData);
  }

  async bulkCreatePrice(pricesData: (IPriceInput & { uploadedBy: string })[]): Promise<IPrice[]> {
    return (await PriceModel.insertMany(pricesData)) as IPrice[];
  }

  async getPriceById(id: string): Promise<IPrice | null> {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'stations',
          localField: 'station',
          foreignField: '_id',
          as: 'station',
        },
      },
      { $unwind: '$station' },
      {
        $lookup: {
          from: 'users',
          localField: 'uploadedBy',
          foreignField: '_id',
          as: 'uploadedBy',
        },
      },
      { $unwind: '$uploadedBy' },
    ];

    const result = await PriceModel.aggregate(pipeline).exec();
    return result.length > 0 ? result[0] : null;
  }

  async getAllPrices(filter: FilterQuery<IPrice> = {}): Promise<IPrice[]> {
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'stations',
          localField: 'station',
          foreignField: '_id',
          as: 'station',
        },
      },
      { $unwind: '$station' },
      {
        $lookup: {
          from: 'users',
          localField: 'uploadedBy',
          foreignField: '_id',
          as: 'uploadedBy',
        },
      },
      { $unwind: '$uploadedBy' },
      { $sort: { date: -1 } },
    ];

    return await PriceModel.aggregate(pipeline).exec();
  }

  async updatePrice(id: string, updateData: Partial<IPriceInput>): Promise<IPrice | null> {
    return await PriceModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deletePrice(id: string): Promise<IPrice | null> {
    return await PriceModel.findByIdAndDelete(id);
  }

  async getPriceAnalysis(): Promise<IPriceAnalysis> {
    const products: ProductType[] = ['PMS', 'AGO', 'DPK', 'LPG', 'ICE'];
    const analysis: IPriceAnalysis = {};

    for (const product of products) {
      const prices = await PriceModel.find({ product }).sort({ date: -1 }).limit(2).populate('station');

      if (prices.length > 0) {
        const latest = prices[0];
        const previous = prices.length > 1 ? prices[1] : null;

        analysis[product] = {
          currentPrice: latest.price,
          priceChange: previous ? latest.price - previous.price : 0,
          percentageChange: previous ? ((latest.price - previous.price) / previous.price) * 100 : 0,
          station: (latest.station as any).name,
          date: latest.date,
        };
      } else {
        analysis[product] = {
          currentPrice: 0,
          priceChange: 0,
          percentageChange: 0,
          station: '',
          date: new Date(),
        };
      }
    }

    return analysis;
  }

  async getPricesWithFilters(filters: {
    product?: ProductType;
    state?: string;
    region?: string;
    stationType?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<IPrice[]> {
    const pipeline: PipelineStage[] = [];

    // Match stage for filters
    const matchStage: Record<string, any> = {};
    if (filters.product) matchStage.product = filters.product;
    if (filters.dateFrom || filters.dateTo) {
      matchStage.date = {};
      if (filters.dateFrom) matchStage.date.$gte = filters.dateFrom;
      if (filters.dateTo) matchStage.date.$lte = filters.dateTo;
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Lookup station information
    pipeline.push({
      $lookup: {
        from: 'stations',
        localField: 'station',
        foreignField: '_id',
        as: 'station',
      },
    });
    pipeline.push({ $unwind: '$station' });

    // Additional station filters
    const stationMatch: Record<string, any> = {};
    if (filters.state) stationMatch['station.state'] = filters.state;
    if (filters.region) stationMatch['station.region'] = filters.region;
    if (filters.stationType) stationMatch['station.type'] = filters.stationType;

    if (Object.keys(stationMatch).length > 0) {
      pipeline.push({ $match: stationMatch });
    }

    // Lookup uploadedBy user
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'uploadedBy',
        foreignField: '_id',
        as: 'uploadedBy',
      },
    });
    pipeline.push({ $unwind: '$uploadedBy' });

    // Sort by date descending
    pipeline.push({ $sort: { date: -1 } });

    return await PriceModel.aggregate(pipeline);
  }
}
