import {
  COUNTRY_CODES,
  type CountryCode,
} from '@fullstack-demo/contracts/greetings';
import { IsIn, IsString } from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  content: string;

  @IsString()
  @IsIn(COUNTRY_CODES)
  countryCode: CountryCode;
}
