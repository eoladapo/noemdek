import mongoose from 'mongoose';
import { mockCreatePrice, mockUpdatePrice, mockDeletePrice, mockGetPriceAnalysis } from './mocks/price.mocks';
import HTTP_STATUS from 'http-status-codes';
import { PriceController } from '@noemdek/controllers/price.controller';

// Mock the entire service module
jest.mock('../../services/price.services');

describe('Price Controller', () => {
  let priceController: PriceController;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    priceController = new PriceController();
    mockNext = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPrice = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    station: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    product: 'PMS',
    price: 650.5,
    date: new Date(),
    uploadedBy: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
  };

  describe('createPrice', () => {
    it('should create a price successfully', async () => {
      mockRequest = {
        body: mockPrice,
        user: { id: '507f1f77bcf86cd799439011' },
      };
      mockCreatePrice.mockResolvedValue(mockPrice);

      await priceController.createPrice(mockRequest, mockResponse, mockNext);

      expect(mockCreatePrice).toHaveBeenCalledWith({
        ...mockPrice,
        uploadedBy: '507f1f77bcf86cd799439011',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPrice);
    });
  });

  describe('updatePrice', () => {
    it('should update a price successfully', async () => {
      const updatedData = { price: 700.0 };
      mockRequest = {
        params: { id: '75b2c3d4e5f6g7h8i9j0k1l' },
        body: updatedData,
      };
      mockUpdatePrice.mockResolvedValue({ ...mockPrice, ...updatedData });

      await priceController.updatePrice(mockRequest, mockResponse, mockNext);

      expect(mockUpdatePrice).toHaveBeenCalledWith('75b2c3d4e5f6g7h8i9j0k1l', updatedData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: { ...mockPrice, ...updatedData },
      });
    });
  });

  describe('deletePrice', () => {
    it('should delete a price successfully', async () => {
      mockRequest = { params: { id: '75b2c3d4e5f6g7h8i9j0k1l' } };
      mockDeletePrice.mockResolvedValue(mockPrice);

      await priceController.deletePrice(mockRequest, mockResponse, mockNext);

      expect(mockDeletePrice).toHaveBeenCalledWith('75b2c3d4e5f6g7h8i9j0k1l');
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('getPriceAnalysis', () => {
    it('should return price analysis data', async () => {
      mockRequest = {};
      const mockAnalysis = {
        PMS: {
          currentPrice: 650.5,
          priceChange: -10.25,
          percentageChange: -1.55,
          station: 'Test Station',
          date: new Date(),
        },
      };
      mockGetPriceAnalysis.mockResolvedValue(mockAnalysis);

      await priceController.getPriceAnalysis(mockRequest, mockResponse, mockNext);

      expect(mockGetPriceAnalysis).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnalysis);
    }, 10000); // Increased timeout
  });
});
