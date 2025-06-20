import { IStation } from '@noemdek/interfaces/station.interface';
import { Schema, model, Model } from 'mongoose';

const stationSchema = new Schema<IStation, Model<IStation>>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['NNPC', 'IOC', 'Private'], required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    lga: { type: String, required: true },
    region: { type: String, required: true },
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

stationSchema.virtual('prices', {
  ref: 'Price',
  localField: '_id',
  foreignField: 'station',
});

const StationModel: Model<IStation> = model<IStation>('Station', stationSchema);
export { StationModel };
