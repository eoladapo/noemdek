import { Document } from 'mongoose';
import { IStation } from './station.interface';
import { IUser } from './user.interface';

export type ProductType = 'PMS' | 'AGO' | 'DPK' | 'LPG' | 'ICE';

export interface IPrice extends Document {
  station: IStation['_id'] | IStation;
  product: ProductType;
  price: number;
  date: Date;
  uploadedBy: IUser['_id'] | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPriceInput {
  station: string;
  product: ProductType;
  price: number;
  date?: Date;
}

export interface IPriceAnalysis {
  [key: string]: {
    currentPrice: number;
    priceChange: number;
    percentageChange: number;
    station: string;
    date: Date;
  };
}
