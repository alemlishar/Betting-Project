import configuration from "src/helpers/configuration";

export type ConfigToEvaluateFormat = {
  value: number;
  factor: number;
};

export function formatNumberWithoutRounding(
  value: number,
  separator: string,
  decimals = configuration.DEFAULT_NUMBER_FORMAT_DECIMALS,
) {
  return toFixedTrunc(value, decimals).replace(".", separator);
}

export function toFixedTrunc(value: number | string, decimals = configuration.DEFAULT_NUMBER_FORMAT_DECIMALS) {
  const valueSplit = (typeof value === "string" ? value : value.toString()).split(".");
  const valueDecimals = valueSplit[0];
  if (decimals <= 0) {
    return valueDecimals;
  }
  let cents = valueSplit[1] || "";
  if (cents.length > decimals) {
    return `${valueDecimals}.${cents.substr(0, decimals)}`;
  }
  while (cents.length < decimals) {
    cents += "0";
  }
  return `${valueDecimals}.${cents}`;
}

export function decimalToInteger(valueToFormatted: ConfigToEvaluateFormat | number | string): string {
  if (typeof valueToFormatted !== "number" && typeof valueToFormatted !== "string") {
    const unformattedValue = valueToFormatted.value;
    const factorDivider = valueToFormatted.factor ? valueToFormatted.factor : 1;
    return formatNumberWithoutRounding(
      unformattedValue / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER ** factorDivider,
      ",",
    );
  } else {
    return typeof valueToFormatted === "number"
      ? formatNumberWithoutRounding(valueToFormatted / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER, ",")
      : formatNumberWithoutRounding(
          Number(valueToFormatted.replace(",", ".")) / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
          ",",
        );
  }
}

export function decimalToIntegerWithoutFormatting(valueToFormatted: ConfigToEvaluateFormat | number | string): number {
  if (typeof valueToFormatted !== "number" && typeof valueToFormatted !== "string") {
    const unformattedValue = valueToFormatted.value;
    const factorDivider = valueToFormatted.factor ? valueToFormatted.factor : 1;
    return unformattedValue / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER ** factorDivider;
  } else {
    return typeof valueToFormatted === "number"
      ? valueToFormatted / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER
      : Number(valueToFormatted.replace(",", ".")) / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER;
  }
}

export function formattedQuota(valueToFormatted: ConfigToEvaluateFormat | number | string): string {
  if (typeof valueToFormatted !== "number" && typeof valueToFormatted !== "string") {
    const unformattedValue = valueToFormatted.value;
    const factorDivider = valueToFormatted.factor ? valueToFormatted.factor : 1;
    return formatNumberWithoutRounding(
      unformattedValue / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER ** factorDivider,
      ".",
    );
  } else {
    return typeof valueToFormatted === "number"
      ? formatNumberWithoutRounding(valueToFormatted / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER, ".")
      : formatNumberWithoutRounding(
          Number(valueToFormatted) / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
          ".",
        );
  }
}
