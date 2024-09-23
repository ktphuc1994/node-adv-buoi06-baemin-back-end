const filterPageAndPageSize = (
  page?: number,
  pageSize?: number,
): { skip?: number; take?: number } => {
  if (!page || !pageSize) return {};

  return { take: pageSize, skip: (page - 1) * pageSize };
};

export { filterPageAndPageSize };
