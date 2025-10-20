import express from 'express';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../validators/userSchema.ts';

const prisma = new PrismaClient();


//  Get all users
export const getUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get user by ID
export const getUserById = async (req: express.Request, res: express.Response) => {
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
      res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Create a new user
export const createUser = async (req: express.Request, res: express.Response) => {
  try {
    const validated = userSchema.parse(req.body);
    const profileImage = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
      validated.email
    )}`;
    const user = await prisma.user.create({
      data: { ...validated, profileImage, totalMinutesPlayed: validated.totalMinutesPlayed ?? 0 },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : error });
  }
};
