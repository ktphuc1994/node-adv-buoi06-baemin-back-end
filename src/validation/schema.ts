import { checkIsInteger, checkIsNumber } from 'src/utils/number';
import { z } from 'zod';

const stringNumberSchema = z
  .custom<number>(
    (value) => {
      return checkIsNumber(value);
    },
    { message: `must be a number` },
  )
  .transform((value) => Number(value));

const stringIntegerSchema = z
  .custom<number>(
    (value) => {
      return checkIsInteger(value);
    },
    { message: `must be a integer` },
  )
  .transform((value) => Number(value));

export { stringNumberSchema, stringIntegerSchema };
