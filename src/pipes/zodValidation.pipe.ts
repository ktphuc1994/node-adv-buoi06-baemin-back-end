import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
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

      let errorMessage = '';
      error.errors.forEach((zodIssue) => {
        const issuePath = zodIssue.path.join('.');
        errorMessage += `'${issuePath}' ${zodIssue.message}. `;
      });

      throw new BadRequestException(errorMessage);
    }
  }
}
