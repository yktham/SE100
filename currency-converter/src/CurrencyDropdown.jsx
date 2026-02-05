import "./CurrencyStyling.css";
import { useEffect, useState } from "react";

export default function CurrencyDropdown({ onChange }) {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("SGD");

  useEffect(() => {
    fetch("https://v6.exchangerate-api.com/v6/f67d05212ce83745dbc72247/codes")
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(data.supported_codes || []);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  // 🔔 Notify parent whenever selection changes
  useEffect(() => {
    onChange?.(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency, onChange]);

  return (
    <div className="container">
      <p>I want to convert</p>

      <select
        className="currency-select"
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        {currencies.map(([code, name]) => (
          <option key={code} value={code}>
            {code} — {name}
          </option>
        ))}
      </select>

      <p>to</p>

      <select
        className="currency-select"
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
      >
        {currencies.map(([code, name]) => (
          <option key={code} value={code}>
            {code} — {name}
          </option>
        ))}
      </select>
    </div>
  );
}