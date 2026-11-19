import { z } from 'zod';
import prisma from '../config/db.js';

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export const getPendingKYC = async (req, res) => {
  try {
    const pendingProfiles = await prisma.kYCProfile.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, phone: true, email: true, role: true } } }
    });
    res.status(200).json({ count: pendingProfiles.length, profiles: pendingProfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching pending KYC' });
  }
};

export const reviewKYC = async (req, res) => {
  try {
    const { kycId } = req.params;
    const validatedData = reviewSchema.parse(req.body);

    const kycProfile = await prisma.kYCProfile.findUnique({
      where: { id: kycId },
      include: { user: true }
    });

    if (!kycProfile) return res.status(404).json({ message: 'KYC Profile not found' });
    if (kycProfile.status !== 'PENDING') return res.status(400).json({ message: 'Already reviewed.' });

    const updatedKYC = await prisma.kYCProfile.update({
      where: { id: kycId },
      data: {
        status: validatedData.status,
        rejectionReason: validatedData.status === 'REJECTED' ? validatedData.rejectionReason : null,
      }
    });

    if (validatedData.status === 'APPROVED') {
      await prisma.user.update({
        where: { id: kycProfile.userId },
        data: { isVerified: true }
      });

      if (kycProfile.user.role === 'MERCHANT') {
        await prisma.merchantProfile.upsert({
          where: { userId: kycProfile.userId },
          update: { isApproved: true },
          create: { 
            userId: kycProfile.userId, 
            storeName: `Store-${kycProfile.user.phone}`, 
            isApproved: true 
          }
        });
      }
    }

    res.status(200).json({
      message: `KYC profile successfully ${validatedData.status.toLowerCase()}`,
      kycStatus: updatedKYC.status
    });

  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ message: 'Validation error', details: error.errors });
    console.error(error);
    res.status(500).json({ message: 'Server error during KYC review' });
  }
};