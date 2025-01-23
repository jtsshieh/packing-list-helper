import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prismaClientSingleton = () => {
	return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

const redisClientSingleton = () => {
	return new Redis(process.env.REDIS_URL!);
};

const redis = globalThis.redisGlobal ?? redisClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.redisGlobal = redis;

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
	redisGlobal: ReturnType<typeof redisClientSingleton>;
} & typeof global;

export { prisma, redis };
