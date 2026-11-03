export const CAL_COM_URL =
  process.env.NEXT_PUBLIC_CAL_COM_URL ||
  process.env.CAL_COM_URL ||
  "https://cal.com/puneet-kala/30min";

export const BUSINESS_EMAIL = "puneetkala.biz@gmail.com";
export const BRAND_NAME = "Puneet Kumar Kala";
export const BUSINESS_TITLE = "Software Engineering Consulting & IT Consulting";
export const BUSINESS_ADDRESS = "Schleizer Str. 80, 13055 Berlin, Germany";
export const TAX_NUMBER = "32/371/02182";

// Bank Transfer Coordinates (Pulled securely from environment, with fallbacks)
export const BANK_ACCOUNT_HOLDER =
  process.env.BANK_ACCOUNT_HOLDER ||
  process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER ||
  process.env.BANK_HOLDER_NAME ||
  process.env.NEXT_PUBLIC_BANK_HOLDER_NAME ||
  "Puneet Kumar Kala";

export const BANK_HOLDER_NAME = BANK_ACCOUNT_HOLDER;

export const BANK_IBAN =
  process.env.BANK_IBAN ||
  process.env.NEXT_PUBLIC_BANK_IBAN ||
  "DE00 0000 0000 0000 0000 00";

export const BANK_BIC =
  process.env.BANK_BIC ||
  process.env.NEXT_PUBLIC_BANK_BIC ||
  "REVODEB2";
