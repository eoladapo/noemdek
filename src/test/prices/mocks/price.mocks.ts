import mongoose from 'mongoose';
import { Response } from 'express';

// Mock functions
export const mockCreatePrice = jest.fn();
export const mockBulkCreatePrices = jest.fn();
export const mockGetPriceById = jest.fn();
export const mockGetAllPrices = jest.fn();
export const mockUpdatePrice = jest.fn();
export const mockDeletePrice = jest.fn();
export const mockGetPriceAnalysis = jest.fn();

// Mock data
export const mockPriceId = new mongoose.Types.ObjectId();
export const mockStationId = new mongoose.Types.ObjectId();
export const mockUserId = new mongoose.Types.ObjectId();

export const mockPrice = {
  _id: mockPriceId,
  station: mockStationId,
  product: 'PMS',
  price: 650.5,
  date: new Date(),
  uploadedBy: mockUserId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock request/response helpers
export const priceMockRequest = (body: any = {}, params: any = {}, currentUser?: any) => ({
  body,
  params,
  currentUser,
  user: currentUser ? { id: currentUser._id } : null,
});

export const priceMockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Prevent this file from being treated as a test suite
export default {};
