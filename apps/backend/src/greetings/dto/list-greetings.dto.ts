import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListGreetingsDto {
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 'asc';
    }
    return String(value).toLowerCase();
  })
  @IsIn(['asc', 'desc'])
  sort: 'asc' | 'desc' = 'asc';

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return 10;
    }
    return Number(value);
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @IsOptional()
  @IsString()
  @IsMongoId()
  cursorId?: string;
}
