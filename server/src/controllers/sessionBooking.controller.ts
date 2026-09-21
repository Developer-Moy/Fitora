import { Request, Response } from "express";
import SessionBooking from "../models/SessionBooking.model";
import Trainer from "../models/trainer.model";
import { sendTrainerSessionEmail } from "../utils/mailer";

export const createSessionBooking = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, trainerId, date, timeSlot } = req.body;

    // Input validation
    if (!fullName || !email || !trainerId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (fullName, email, trainerId, date, timeSlot)",
      });
    }

    // Check if trainer exists
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Check for duplicate booking (same trainer, date, and time slot)
    const existingBooking = await SessionBooking.findOne({
      trainerId,
      date: new Date(date),
      timeSlot,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked for this trainer. Please select another time.",
      });
    }

    // Create booking
    const newBooking = await SessionBooking.create({
      fullName,
      email,
      phone,
      trainerId,
      date,
      timeSlot,
      status: "pending",
    });

    // Send email to trainer
    if (trainer.email) {
        await sendTrainerSessionEmail(trainer.email, newBooking);
    } else {
        await sendTrainerSessionEmail("developermoy@gmail.com", newBooking);
    }

    res.status(201).json({
      success: true,
      message: "Session booked successfully! The trainer has been notified.",
      data: newBooking,
    });
  } catch (error: any) {
    console.error("Error creating session booking:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while booking the session.",
      error: error.message,
    });
  }
};

export const getBookedSlots = async (req: Request, res: Response) => {
  try {
    const { trainerId, date } = req.query;

    if (!trainerId || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide both trainerId and date parameters.",
      });
    }

    const bookings = await SessionBooking.find({
      trainerId,
      date: new Date(date as string),
    }).select("timeSlot");

    const bookedSlots = bookings.map((booking) => booking.timeSlot);

    res.status(200).json({
      success: true,
      data: bookedSlots,
    });
  } catch (error: any) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching booked slots.",
      error: error.message,
    });
  }
};
