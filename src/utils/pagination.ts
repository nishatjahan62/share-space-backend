export const getPagination = (page?: string, limit?: string) => {
  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return { skip: (pageNum - 1) * limitNum, take: limitNum, pageNum, limitNum };
};