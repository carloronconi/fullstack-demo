export const COUNTRY_CODES = ['US', 'ES', 'FR', 'DE'] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Greeting = {
  content: string;
  countryCode: CountryCode;
  createdAt: Date;
};
