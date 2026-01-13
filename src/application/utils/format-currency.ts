const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "USD";

type FormatCurrencyOptions = {
  locale?: string;
  currency?: string;
};

const formatCurrency = (value: number, options?: FormatCurrencyOptions) => {
  const locale = options?.locale ?? DEFAULT_LOCALE;
  const currency = options?.currency ?? DEFAULT_CURRENCY;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export default formatCurrency;
