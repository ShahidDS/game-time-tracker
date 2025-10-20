import type { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { userSchema, userUpdateSchema } from '../validators/userSchema.ts';

const prisma = new PrismaClient();

//  Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const validated = userSchema.parse(req.body);
    // Generate a profile image URL
    const profileImage = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
      validated.email
    )}`;
    const user = await prisma.user.create({
      data: {
        ...validated,
        profileImage,
        totalMinutesPlayed: validated.totalMinutesPlayed ?? 0,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : error });
  }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const validated = userUpdateSchema.parse(req.body);
    
    const updateData: Prisma.UserUpdateInput = {};
    if (validated.firstName !== undefined) updateData.firstName = validated.firstName;
    if (validated.lastName !== undefined) updateData.lastName = validated.lastName;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.totalMinutesPlayed !== undefined) updateData.totalMinutesPlayed = validated.totalMinutesPlayed;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error });
  }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'User deleted successfully'});
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
