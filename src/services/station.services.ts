import { IStation, IStationInput } from '@noemdek/interfaces/station.interface';
import { StationModel } from '@noemdek/models/station.schema';
import { FilterQuery } from 'mongoose';

export class StationService {
  async createStation(stationData: IStationInput): Promise<IStationInput | null> {
    return await StationModel.create(stationData);
  }

  async getStationById(id: string): Promise<IStation | null> {
    return await StationModel.findById(id).populate('prices').exec();
  }

  async getAllStations(filter: FilterQuery<IStation>): Promise<IStation[]> {
    return await StationModel.find(filter);
  }

  async updateStation(id: string, updateData: Partial<IStationInput>): Promise<IStation | null> {
    return await StationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteStation(id: string): Promise<IStation | null> {
    return await StationModel.findByIdAndDelete(id).exec();
  }

  async getStationsByLocation(filter: {
    state?: string;
    city?: string;
    lga?: string;
    region?: string;
  }): Promise<IStation[]> {
    const query: FilterQuery<IStation> = {};
    if (filter.state) query.state = filter.state;
    if (filter.city) query.city = filter.city;
    if (filter.lga) query.lga = filter.lga;
    if (filter.region) query.region = filter.region;
    return this.getAllStations(query);
  }
}
