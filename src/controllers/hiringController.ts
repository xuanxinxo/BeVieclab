import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy tất cả tin tuyển dụng
export const getHirings = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const hirings = await prisma.hiring.findMany();
    return res.status(200).json(hirings);
  } catch (error) {
    console.error('Error getting hirings:', error);
    return res.status(500).json({ error: 'Failed to get hirings' });
  }
};

// Tạo tin tuyển dụng mới
export const createHiring = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
      deadline,
      postedDate,
      img,
    } = req.body;

    if (!title || !company || !location || !type || !salary || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hiring = await prisma.hiring.create({
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements: requirements || [],
        benefits: benefits || [],
        deadline: new Date(deadline),
        postedDate: postedDate ? new Date(postedDate) : new Date(),
        img,
      },
    });

    return res.status(201).json(hiring);
  } catch (error) {
    console.error('Error creating hiring:', error);
    return res.status(500).json({ error: 'Failed to create hiring' });
  }
};

// Lấy chi tiết tin tuyển dụng
export const getHiringById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const hiring = await prisma.hiring.findUnique({
      where: { id },
    });

    if (!hiring) {
      return res.status(404).json({ error: 'Hiring not found' });
    }

    return res.status(200).json(hiring);
  } catch (error) {
    console.error('Error getting hiring:', error);
    return res.status(500).json({ error: 'Failed to get hiring' });
  }
};

// Cập nhật tin tuyển dụng
export const updateHiring = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
      benefits,
      deadline,
      img,
    } = req.body;

    const updatedHiring = await prisma.hiring.update({
      where: { id },
      data: {
        title,
        company,
        location,
        type,
        salary,
        description,
        requirements,
        benefits,
        deadline: deadline ? new Date(deadline) : undefined,
        img,
      },
    });

    return res.status(200).json(updatedHiring);
  } catch (error) {
    console.error('Error updating hiring:', error);
    return res.status(500).json({ error: 'Failed to update hiring' });
  }
};

// Xóa tin tuyển dụng
export const deleteHiring = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    await prisma.hiring.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Hiring deleted successfully' });
  } catch (error) {
    console.error('Error deleting hiring:', error);
    return res.status(500).json({ error: 'Failed to delete hiring' });
  }
};
