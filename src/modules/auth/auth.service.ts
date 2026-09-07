import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../../src/utils/ApiError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../src/utils/token.js";

export const registerUser = async (name: string, email: string, password: string, role: "OWNER" | "TENANT") => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  return issueTokens(user.id, user.role);
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email, deletedAt: null } });
  if (!user || !user.passwordHash) throw new ApiError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  return issueTokens(user.id, user.role);
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    return issueTokens(payload.userId, payload.role);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

const issueTokens = (userId: string, role: string) => ({
  accessToken: signAccessToken({ userId, role }),
  refreshToken: signRefreshToken({ userId, role }),
});