const calculateTip = (total, tipPercentage = 0.25) =>
  total + total * tipPercentage;

const fahrenheitToCelsius = (temperature) => {
  return (temperature - 32) / 1.8;
};

const celsiusToFahrenheit = (temperature) => {
  return temperature * 1.8 + 32;
};

module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
};
