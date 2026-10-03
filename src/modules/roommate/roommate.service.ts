import { prisma } from "../../config/prisma.js";
type ProfileInput = {
  budgetMin: number;
  budgetMax: number;
  preferredCity: string;
  lifestyleTags: string[];
  bio?: string | null;
};

type ProfileWithUser = Awaited<ReturnType<typeof prisma.roommateProfile.findMany>>[number];

export const upsertProfile = (userId: string, data: ProfileInput) =>
  prisma.roommateProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

export const getMyProfile = (userId: string) =>
  prisma.roommateProfile.findUnique({ where: { userId } });

function scoreMatch(me: ProfileInput, other: ProfileInput): number {
  let score = 0;

  const budgetOverlap = Math.max(
    0,
    Math.min(me.budgetMax, other.budgetMax) - Math.max(me.budgetMin, other.budgetMin)
  );
  if (budgetOverlap > 0) score += 40;

  if (me.preferredCity.toLowerCase() === other.preferredCity.toLowerCase()) score += 30;

  const sharedTags = me.lifestyleTags.filter((t) => other.lifestyleTags.includes(t));
  score += sharedTags.length * 10;

  return score;
}

export const findMatches = async (userId: string) => {
  const me = await prisma.roommateProfile.findUnique({ where: { userId } });
  if (!me) return [];

  const others: ProfileWithUser[] = await prisma.roommateProfile.findMany({
    where: { userId: { not: userId } },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return others
    .map((other: ProfileWithUser) => ({ ...other, matchScore: scoreMatch(me, other) }))
    .filter((o) => o.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};