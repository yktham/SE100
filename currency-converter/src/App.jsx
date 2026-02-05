import "./App.css";
import { useState } from "react";
import CurrencyDropdown from "./CurrencyDropdown";
import CurrencyConverter from "./CurrencyConverter";

export default function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("SGD");

  return (
    <div className="app">
      <h1 className="app-title">Currency Converter</h1>

      <CurrencyDropdown
        onChange={(from, to) => {
          setFromCurrency(from);
          setToCurrency(to);
        }}
      />

      <CurrencyConverter
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        currencies={[]} 
      />
    </div>
  );
}