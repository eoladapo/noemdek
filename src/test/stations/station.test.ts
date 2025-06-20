import mongoose from 'mongoose';
import { mockCreateStation, mockGetStationById, mockUpdateStation, mockDeleteStation } from './mocks/station.mocks';
import HTTP_STATUS from 'http-status-codes';
import { StationController } from '@noemdek/controllers/station.controller';
import { NotFoundError } from '@noemdek/utils/helpers/error-handler';

// Mock the entire service module
jest.mock('../../services/station.services');

describe('Station Controller', () => {
  let stationController: StationController;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    stationController = new StationController();
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

  const mockStation = {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    name: 'Test Station',
    type: 'NNPC',
    state: 'Lagos',
    city: 'Ikeja',
    address: '1 Station Road',
    lga: 'Ikeja',
    region: 'Southwest',
  };

  describe('createStation', () => {
    it('should create a station successfully', async () => {
      mockRequest = { body: mockStation };
      mockCreateStation.mockResolvedValue(mockStation);

      await stationController.createStation(mockRequest, mockResponse, mockNext);

      expect(mockCreateStation).toHaveBeenCalledWith(mockStation);
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(mockStation);
    });
  });

  describe('getStation', () => {
    it('should return a station by ID', async () => {
      mockRequest = { params: { id: '65a1b2c3d4e5f6g7h8i9j0k' } };
      mockGetStationById.mockResolvedValue(mockStation);

      await stationController.getStation(mockRequest, mockResponse, mockNext);

      expect(mockGetStationById).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k');
      expect(mockResponse.json).toHaveBeenCalledWith(mockStation);
    });

    it('should return 404 if station not found', async () => {
      mockRequest = { params: { id: '65a1b2c3d4e5f6g7h8i9j0k' } };
      mockGetStationById.mockResolvedValue(null);

      await stationController.getStation(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('updateStation', () => {
    it('should update a station successfully', async () => {
      const updatedData = { name: 'Updated Name' };
      mockRequest = {
        params: { id: '65a1b2c3d4e5f6g7h8i9j0k' },
        body: updatedData,
      };
      mockUpdateStation.mockResolvedValue({ ...mockStation, ...updatedData });

      await stationController.updateStation(mockRequest, mockResponse, mockNext);

      expect(mockUpdateStation).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k', updatedData);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: { ...mockStation, ...updatedData },
      });
    });
  });

  describe('deleteStation', () => {
    it('should delete a station successfully', async () => {
      mockRequest = { params: { id: '65a1b2c3d4e5f6g7h8i9j0k' } };
      mockDeleteStation.mockResolvedValue(mockStation);

      await stationController.deleteStation(mockRequest, mockResponse, mockNext);

      expect(mockDeleteStation).toHaveBeenCalledWith('65a1b2c3d4e5f6g7h8i9j0k');
      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
