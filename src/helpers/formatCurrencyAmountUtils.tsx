import { FormattedNumberParts } from "react-intl";
import configuration from "src/helpers/configuration";
import { ConfigToEvaluateFormat, formatNumberWithoutRounding } from "src/helpers/formatUtils";

export function decimalToIntegerValue(valueToFormatted: ConfigToEvaluateFormat | number | string): number {
  if (typeof valueToFormatted !== "number" && typeof valueToFormatted !== "string") {
    const unformattedValue = valueToFormatted.value;
    const factorDivider = valueToFormatted.factor ? valueToFormatted.factor : 1;
    return Number(
      formatNumberWithoutRounding(
        unformattedValue / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER ** factorDivider,
        ".",
      ),
    );
  } else {
    return typeof valueToFormatted === "number"
      ? Number(
          formatNumberWithoutRounding(valueToFormatted / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER, "."),
        )
      : Number(
          formatNumberWithoutRounding(
            Number(valueToFormatted.replace(",", ".")) / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
            ".",
          ),
        );
  }
}

export function formatCurrency(amount: number): JSX.Element {
  return (
    <FormattedNumberParts value={amount} currencyDisplay="symbol" minimumFractionDigits={2} maximumFractionDigits={2}>
      {(parts) => (
        <>
          {`€ ${parts
            .map(({ value }) => {
              return value;
            })
            .join("")}`}
        </>
      )}
    </FormattedNumberParts>
  );
}
