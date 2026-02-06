import prisma from '../utils/prismaClient.js';

export const create = async (data) => {
    try {
        return await prisma.food.create({ data });
    } catch (error) {
        throw error;
    }
};

export const findAll = async (filters = {}) => {
    try {
        const { name, category, available } = filters;
        const where = {};

        if (name) where.name = { contains: name, mode: 'insensitive' };
        if (category) where.category = { equals: category, mode: 'insensitive' };
        if (available !== undefined) {
            where.available = available === 'true' || available === true;
        }

        return await prisma.food.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        throw error;
    }
};

export const findById = async (id) => {
    try {
        return await prisma.food.findUnique({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        throw error;
    }
};

export const update = async (id, data) => {
    try {
        return await prisma.food.update({
            where: { id: parseInt(id) },
            data,
        });
    } catch (error) {
        throw error;
    }
};

export const remove = async (id) => {
    try {
        return await prisma.food.delete({
            where: { id: parseInt(id) },
        });
    } catch (error) {
        throw error;
    }
};
