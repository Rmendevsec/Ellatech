import { z } from 'zod';
import prisma from '../config/db.js';

const kycSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  nationalIdNumber: z.string().min(5, 'National ID number is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactAddress: z.string().min(2, 'Emergency contact address is required'),
  tinNumber: z.string().optional(),
  storeAddress: z.string().optional(),
  storeNumber: z.string().optional(),
});

export const submitKYC = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const validatedData = kycSchema.parse(req.body);

    const existingKYC = await prisma.kYCProfile.findUnique({
      where: { userId }
    });

    if (existingKYC) {
      return res.status(400).json({ message: 'KYC profile already exists for this user.' });
    }

    const nationalIdImageUrl = req.files?.['nationalIdImage'] ? `/uploads/${req.files['nationalIdImage'][0].filename}` : null;
    const drivingLicenseUrl = req.files?.['drivingLicenseImage'] ? `/uploads/${req.files['drivingLicenseImage'][0].filename}` : null;
    const tradeLicenseUrl = req.files?.['tradeLicenseImage'] ? `/uploads/${req.files['tradeLicenseImage'][0].filename}` : null;

    if (!nationalIdImageUrl) {
      return res.status(400).json({ message: 'National ID image is required.' });
    }
    if (role === 'DRIVER' && !drivingLicenseUrl) {
      return res.status(400).json({ message: 'Driving License image is required for drivers.' });
    }
    if (role === 'MERCHANT' && !tradeLicenseUrl) {
      return res.status(400).json({ message: 'Trade License image is required for merchants.' });
    }

    const kycProfile = await prisma.kYCProfile.create({
      data: {
        userId,
        fullName: validatedData.fullName,
        nationalIdNumber: validatedData.nationalIdNumber,
        nationalIdImageUrl,
        emergencyContactName: validatedData.emergencyContactName,
        emergencyContactPhone: validatedData.emergencyContactPhone,
        emergencyContactAddress: validatedData.emergencyContactAddress,
        drivingLicenseUrl,
        tradeLicenseUrl,
        tinNumber: validatedData.tinNumber,
        storeAddress: validatedData.storeAddress,
        storeNumber: validatedData.storeNumber,
        status: 'PENDING', // Admin must approve this later
      }
    });

    res.status(201).json({
      message: 'KYC documents submitted successfully. Pending Admin approval.',
      kycProfile: {
        id: kycProfile.id,
        status: kycProfile.status
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', details: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during KYC submission' });
  }
};