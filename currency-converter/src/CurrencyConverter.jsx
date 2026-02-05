import { useState, useMemo } from "react";
import "./CurrencyConverter.css";

export default function CurrencyConverter({
  fromCurrency,
  toCurrency,
  currencies,
}) {
  const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  const [amount, setAmount] = useState("1");
  const [converted, setConverted] = useState(null);
  const [rate, setRate] = useState(null);
  const [loadingConvert, setLoadingConvert] = useState(false);
  const [error, setError] = useState("");

  // Build a lookup: { USD: "United States Dollar", ... }
  const currencyMap = useMemo(() => {
    const map = {};
    currencies.forEach(([code, name]) => {
      map[code] = name;
    });
    return map;
  }, [currencies]);

  async function handleConvert(e) {
    e.preventDefault();

    const num = Number(amount);
    if (!Number.isFinite(num) || num < 0) {
      setError("Please enter a valid non-negative amount.");
      return;
    }

    try {
      setLoadingConvert(true);
      setError("");

      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${num}`
      );
      const data = await res.json();

      if (!res.ok || data.result !== "success") {
        throw new Error(data["error-type"] || "Conversion failed");
      }

      setRate(data.conversion_rate);
      setConverted(data.conversion_result);
    } catch (err) {
      setError(err.message || "Conversion failed");
    } finally {
      setLoadingConvert(false);
    }
  }

  return (
    <div className="cc-container">
      <form className="cc-form" onSubmit={handleConvert}>
        <label className="cc-label">
          Amount
          <input
            className="cc-input"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        {/* ✅ This is the line you asked for */}
        <p className="cc-summary">
          From{" "}
          <strong>
            {fromCurrency} – {currencyMap[fromCurrency]}
          </strong>{" "}
          To{" "}
          <strong>
            {toCurrency} – {currencyMap[toCurrency]}
          </strong>
        </p>

        <button className="cc-button" type="submit" disabled={loadingConvert}>
          {loadingConvert ? "Converting…" : "Convert"}
        </button>

        {error && <p className="cc-error">Error: {error}</p>}

        {converted !== null && (
          <div className="cc-result">
            {amount} {fromCurrency} ={" "}
            <strong>
              {converted.toFixed(6)} {toCurrency}
            </strong>
          </div>
        )}

        {rate && (
          <p className="cc-muted">
            Rate: 1 {fromCurrency} = {rate} {toCurrency}
          </p>
        )}
      </form>
    </div>
  );
}