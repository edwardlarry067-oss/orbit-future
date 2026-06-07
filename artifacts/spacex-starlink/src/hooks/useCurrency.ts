import { useState, useEffect } from "react";

const GEO_CACHE_KEY = "orbit_geo_country";
const RATE_CACHE_KEY = "orbit_ngn_rate";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const DEFAULT_NGN_RATE = 1600;

export type SupportedCurrency = "NGN" | "USD";

function getCached(key: string): string | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) { localStorage.removeItem(key); return null; }
    return String(value);
  } catch { return null; }
}

function setCache(key: string, value: string | number) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + CACHE_TTL }));
  } catch {}
}

export function useCurrency() {
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");
  const [rate, setRate] = useState(DEFAULT_NGN_RATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      try {
        let country = getCached(GEO_CACHE_KEY);

        if (!country) {
          const res = await fetch("https://ipapi.co/country/", {
            signal: AbortSignal.timeout(5000),
          });
          country = (await res.text()).trim();
          if (country && country.length === 2) {
            setCache(GEO_CACHE_KEY, country);
          }
        }

        if (country === "NG") {
          let ngnRate = DEFAULT_NGN_RATE;
          const cachedRate = getCached(RATE_CACHE_KEY);

          if (cachedRate) {
            ngnRate = parseFloat(cachedRate);
          } else {
            try {
              const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", {
                signal: AbortSignal.timeout(5000),
              });
              const data = await rateRes.json();
              if (data?.rates?.NGN) {
                ngnRate = data.rates.NGN;
                setCache(RATE_CACHE_KEY, ngnRate);
              }
            } catch {
              // use default
            }
          }

          setCurrency("NGN");
          setRate(ngnRate);
        }
      } catch {
        // default to USD on any error
      } finally {
        setLoading(false);
      }
    }

    detect();
  }, []);

  function formatPrice(usdAmount: number): string {
    if (currency === "NGN") {
      const ngn = Math.round(usdAmount * rate);
      return `₦${ngn.toLocaleString("en-NG")}`;
    }
    return `$${usdAmount}`;
  }

  function formatMonthly(usdAmount: number): string {
    return `${formatPrice(usdAmount)}/mo`;
  }

  const symbol = currency === "NGN" ? "₦" : "$";

  return { currency, symbol, rate, loading, formatPrice, formatMonthly };
}
