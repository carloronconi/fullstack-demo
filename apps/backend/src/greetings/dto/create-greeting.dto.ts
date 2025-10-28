import { COUNTRY_CODES, type CountryCode } from '../entity/greeting.entity';
import { IsIn, IsString } from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  content: string;

  @IsString()
  @IsIn(COUNTRY_CODES)
  countryCode: CountryCode;
}
