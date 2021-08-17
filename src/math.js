const calculateTip = (total, tipPercentage = 0.25) =>
  total + total * tipPercentage;

const fahrenheitToCelsius = (temperature) => {
  return (temperature - 32) / 1.8;
};

const celsiusToFahrenheit = (temperature) => {
  return temperature * 1.8 + 32;
};

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("Numbers must be positive");
      }
      resolve(a + b);
    }, 2000);
  });
};

module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add,
};
