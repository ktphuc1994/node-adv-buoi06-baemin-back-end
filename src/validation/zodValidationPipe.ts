import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { INVALID_FIELD } from 'src/constants/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (!(error instanceof ZodError))
        throw new BadRequestException('Validation failed');

      let errorMessage = error.errors[0].message;
      if (error.errors[0].message.includes(INVALID_FIELD))
        errorMessage = errorMessage.replace(
          INVALID_FIELD,
          error.errors[0].path.at(-1)?.toString() ?? INVALID_FIELD,
        );

      throw new BadRequestException(errorMessage);
    }
  }
}
