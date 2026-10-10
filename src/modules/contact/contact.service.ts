import { prisma } from "../../config/prisma.js";

export const createContactMessage = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) =>
  prisma.contactMessage.create({
    data,
    select: {
      id: true,
      createdAt: true,
    },
  });