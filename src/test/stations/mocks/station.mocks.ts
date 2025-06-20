import mongoose from 'mongoose';
import { Response } from 'express';

// Mock functions
export const mockCreateStation = jest.fn();
export const mockGetStationById = jest.fn();
export const mockUpdateStation = jest.fn();
export const mockDeleteStation = jest.fn();
export const mockGetStationsByLocation = jest.fn();

// Mock data
export const mockStationId = new mongoose.Types.ObjectId();
export const mockUserId = new mongoose.Types.ObjectId();

export const mockStation = {
  _id: mockStationId,
  name: 'Test Station',
  type: 'NNPC',
  state: 'Lagos',
  city: 'Ikeja',
  address: '1 Station Road',
  lga: 'Ikeja',
  region: 'Southwest',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock request/response helpers
export const stationMockRequest = (body: any = {}, params: any = {}, currentUser?: any) => ({
  body,
  params,
  currentUser,
});

export const stationMockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Prevent this file from being treated as a test suite
export default {};
