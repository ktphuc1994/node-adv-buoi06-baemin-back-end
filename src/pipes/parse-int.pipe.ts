import { ArgumentMetadata, ParseIntPipe } from '@nestjs/common';

export class EnhancedParseIntPipe extends ParseIntPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    try {
      return await super.transform(value, metadata);
    } catch {
      let errorMessage = 'numeric string is expected';
      if (metadata.data) {
        errorMessage = `${metadata.data} must be a numeric string`;
      }
      throw this.exceptionFactory(errorMessage);
    }
  }
}
