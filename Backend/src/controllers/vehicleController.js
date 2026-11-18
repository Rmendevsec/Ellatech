import { z } from 'zod';
import prisma from '../config/db.js';

const vehicleSchema = z.object({
  type: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']),
  plateNumber: z.string().min(5),
  make: z.string().min(2),
  model: z.string().min(2),
  year: z.number().int().min(1990).max(new Date().getFullYear()),
  chassisNumber: z.string().optional(),
});

export const addVehicle = async (req, res) => {
  try {
    const driverId = req.user.id;
    
    // 1. Validate data
    const validatedData = vehicleSchema.parse(req.body);

    // 2. Check if plate number already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: validatedData.plateNumber }
    });

    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this plate number already exists.' });
    }

    // 3. Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        driverId,
        type: validatedData.type,
        plateNumber: validatedData.plateNumber,
        make: validatedData.make,
        model: validatedData.model,
        year: validatedData.year,
        chassisNumber: validatedData.chassisNumber,
      }
    });

    // 4. Automatically create a DriverProfile if it doesn't exist
    await prisma.driverProfile.upsert({
      where: { userId: driverId },
      update: {},
      create: { userId: driverId }
    });

    res.status(201).json({
      message: 'Vehicle registered successfully',
      vehicle
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during vehicle registration' });
  }
};