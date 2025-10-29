import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Value must be a valid ObjectId string');
    }

    return value;
  }
}
