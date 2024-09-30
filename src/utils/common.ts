const filterPageAndPageSize = (
  page?: number,
  pageSize?: number,
): { skip?: number; take?: number } => {
  if (!page || !pageSize) return {};

  return { take: pageSize, skip: (page - 1) * pageSize };
};

const checkIsArrayDuplicated = (arrayToCheck: number[] | string[]): boolean => {
  const checkedObject: Record<string | number, true> = {};
  for (let item of arrayToCheck) {
    if (checkedObject[item]) return true;
    checkedObject[item] = true;
  }

  return false;
};

export { filterPageAndPageSize, checkIsArrayDuplicated };
