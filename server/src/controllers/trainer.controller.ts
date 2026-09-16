import { Request, Response } from 'express';
import Trainer from '../models/trainer.model';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getTrainers = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainers = await Trainer.find().lean();
    res.status(200).json(successResponse('Trainers retrieved successfully', trainers));
  } catch (error: any) {
    console.error('Error fetching trainers:', error);
    res.status(500).json(errorResponse('Failed to fetch trainers', error.message, 500));
  }
};
