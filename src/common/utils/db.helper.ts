import { SelectQueryBuilder } from 'typeorm';

export const andConditionUtils = <T>(
  qb: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  Object.keys(obj).forEach((key) => {
    qb.andWhere(`${key} = :${key}`, { [key]: obj[key] });
  });
  return qb;
};
