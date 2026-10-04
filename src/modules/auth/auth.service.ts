import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
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

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (idToken: string, role: "OWNER" | "TENANT") => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new ApiError(401, "Invalid Google token");

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: payload.sub }, { email: payload.email }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name || payload.email,
        email: payload.email,
        googleId: payload.sub,
        role,
        isVerified: true,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({ where: { id: user.id }, data: { googleId: payload.sub } });
  }

  return issueTokens(user.id, user.role);
};