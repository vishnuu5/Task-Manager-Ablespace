import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class UserRepository {
  async findByEmail(email: string): Promise<any | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  async findById(id: string): Promise<any | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  async create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<any> {
    return prisma.user.create({ data });
  }
  async update(id: string, data: { name?: string }): Promise<any> {
    return prisma.user.update({ where: { id }, data });
  }

  async findAll(): Promise<any[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      } as any,
    });
  }
}
