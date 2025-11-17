export const COUNTRY_CODES = ["US", "ES", "FR", "DE"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Greeting = {
  id: string;
  content: string;
  countryCode: CountryCode;
  createdAt: string;
};

export type CreateGreetingPayload = {
  content: string;
  countryCode: CountryCode;
};

export type CursorPaginationResult<T> = {
  items: T[];
  limit: number;
  sort: "asc" | "desc";
  nextAscCursorId: string | null;
  nextDescCursorId: string | null;
};
