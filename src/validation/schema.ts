import { INVALID_FIELD } from 'src/constants/common';
import { checkIsInteger, checkIsNumber } from 'src/utils/number';
import { z } from 'zod';

const stringNumberSchema = z
  .custom<number>(
    (value) => {
      return checkIsNumber(value);
    },
    { message: `${INVALID_FIELD} must be a number` },
  )
  .transform((value) => Number(value));

const stringIntegerSchema = z
  .custom<number>(
    (value) => {
      return checkIsInteger(value);
    },
    { message: `${INVALID_FIELD} must be a integer` },
  )
  .transform((value) => Number(value));

export { stringNumberSchema, stringIntegerSchema };
