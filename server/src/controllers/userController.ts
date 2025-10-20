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