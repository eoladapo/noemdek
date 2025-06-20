import { IPrice } from '@noemdek/interfaces/price.interfaces';
import { Schema, model, Model } from 'mongoose';

const priceSchema = new Schema<IPrice, Model<IPrice>>(
  {
    station: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
    product: { type: String, enum: ['PMS', 'AGO', 'DPK', 'LPG', 'ICE'] },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

priceSchema.index({ station: 1, product: 1, date: 1 }, { unique: true });

const PriceModel: Model<IPrice> = model<IPrice>('Price', priceSchema);
export { PriceModel };
