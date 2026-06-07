import { useState, useEffect } from "react";

const GEO_CACHE_KEY = "orbit_geo_country";
const RATES_CACHE_KEY = "orbit_fx_rates";
const CACHE_TTL = 24 * 60 * 60 * 1000;

export type SupportedCurrency =
  | "USD" | "NGN" | "GBP" | "EUR" | "CAD" | "AUD" | "BRL" | "MXN"
  | "INR" | "KES" | "GHS" | "ZAR" | "NZD" | "JPY" | "PHP" | "IDR"
  | "CLP" | "COP" | "PEN" | "TZS" | "UGX" | "RWF" | "XOF";

const COUNTRY_CURRENCY: Record<string, SupportedCurrency> = {
  NG: "NGN",
  GB: "GBP",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR",
  AT: "EUR", PT: "EUR", IE: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR",
  CA: "CAD",
  AU: "AUD",
  BR: "BRL",
  MX: "MXN",
  IN: "INR",
  KE: "KES",
  GH: "GHS",
  ZA: "ZAR",
  NZ: "NZD",
  JP: "JPY",
  PH: "PHP",
  ID: "IDR",
  CL: "CLP",
  CO: "COP",
  PE: "PEN",
  TZ: "TZS",
  UG: "UGX",
  RW: "RWF",
  SN: "XOF", CI: "XOF", BF: "XOF", ML: "XOF", GN: "XOF", NE: "XOF", TG: "XOF", BJ: "XOF",
};

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: "$", NGN: "₦", GBP: "£", EUR: "€", CAD: "CA$", AUD: "A$",
  BRL: "R$", MXN: "MX$", INR: "₹", KES: "KSh", GHS: "GH₵", ZAR: "R",
  NZD: "NZ$", JPY: "¥", PHP: "₱", IDR: "Rp", CLP: "$", COP: "$",
  PEN: "S/", TZS: "TSh", UGX: "USh", RWF: "Fr", XOF: "CFA",
};

const NO_DECIMALS = new Set<SupportedCurrency>(["JPY", "IDR", "CLP", "COP", "UGX", "RWF", "XOF", "NGN", "KES", "GHS", "TZS"]);

function getCachedJson(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
    return value;
  } catch { return null; }
}

function setCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + CACHE_TTL }));
  } catch {}
}

export function useCurrency() {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      try {
        let country = getCachedJson(GEO_CACHE_KEY) as string | null;
        if (!country) {
          const res = await fetch("https://ipapi.co/country/", { signal: AbortSignal.timeout(5000) });
          country = (await res.text()).trim();
          if (country && country.length === 2) setCache(GEO_CACHE_KEY, country);
        }

        const detectedCurrency: SupportedCurrency = COUNTRY_CURRENCY[country ?? ""] ?? "USD";
        if (detectedCurrency === "USD") { setLoading(false); return; }

        let cachedRates = getCachedJson(RATES_CACHE_KEY) as Record<string, number> | null;
        if (!cachedRates) {
          try {
            const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5000) });
            const data = await rateRes.json();
            if (data?.rates) { cachedRates = data.rates; setCache(RATES_CACHE_KEY, cachedRates); }
          } catch {}
        }

        if (cachedRates) {
          setRates(cachedRates);
          setCurrency(detectedCurrency);
        }
      } catch {
        // default to USD on any error
      } finally {
        setLoading(false);
      }
    }
    detect();
  }, []);

  function convert(usdAmount: number): number {
    if (currency === "USD") return usdAmount;
    return usdAmount * (rates[currency] ?? 1);
  }

  function formatPrice(usdAmount: number): string {
    if (currency === "USD") return `$${usdAmount.toLocaleString("en-US")}`;
    const converted = convert(usdAmount);
    const sym = CURRENCY_SYMBOLS[currency] ?? currency;
    const rounded = NO_DECIMALS.has(currency) ? Math.round(converted) : Math.round(converted * 100) / 100;
    return `${sym}${rounded.toLocaleString()}`;
  }

  function formatMonthly(usdAmount: number): string {
    return `${formatPrice(usdAmount)}/mo`;
  }

  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";

  return { currency, symbol, rates, loading, formatPrice, formatMonthly, convert };
}
