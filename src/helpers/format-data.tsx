export const parseAsMoney = (value: number, isAvailable?: boolean, needEuro?: boolean): string => {
  if (isAvailable === false) {
    return "€ 0,00";
  }

  const toBeParsed = isNaN(value) ? 0 : value;
  let roundedValue = (Math.round(toBeParsed * 100) / 100).toFixed(2).replace(".", ",");
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(roundedValue)) {
    roundedValue = roundedValue.replace(rgx, "$1.$2");
  }
  if (needEuro) {
    return `${roundedValue}`;
  }
  return `€ ${roundedValue}`;
};

export const truncate = (value: number, truncation: number) => {
  if (value !== undefined && value !== null) {
    let stringValue = value.toString();
    if (stringValue.indexOf(".") > -1) {
      return stringValue.slice(0, stringValue.indexOf(".") + truncation + 1);
    } else {
      return stringValue;
    }
  }
  return "0.00";
};
