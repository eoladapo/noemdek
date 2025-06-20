import { Document } from 'mongoose';

export interface IStation extends Document {
  name: string;
  type: 'NNPC' | 'IOC' | 'Private';
  state: string;
  city: string;
  address: string;
  lga: string;
  region: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStationInput {
  name: string;
  type: 'NNPC' | 'IOC' | 'Private';
  state: string;
  city: string;
  address: string;
  lga: string;
  region: string;
}
