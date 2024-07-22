import { useSelector } from 'react-redux';
import { getIntlLocale } from '../ducks/locale/locale';
import { getCurrentCurrency } from '../selectors';
import { shortenString } from '../helpers/utils/util';

/**
 * Returns a function that formats a fiat amount as a localized string.
 * The hook takes an optional boolean parameter to shorten the fiat value.
 *
 * Example usage:
 *
 * ```
 * const formatFiat = useFiatFormatter();
 * const formattedAmount = formatFiat(1000);
 *
 * const shorteningFiatFormatter = useFiatFormatter(true);
 * const shortenedAmount = shorteningFiatFormatter(100000000000000000);
 * ```
 *
 * @returns A function that takes a fiat amount as a number and returns a formatted string.
 */

const TRUNCATED_CHAR_LIMIT_FOR_SHORTENED_FIAT = 15;
const TRUNCATED_START_CHARS_FOR_SHORTENED_FIAT = 12;

type FiatFormatter = (fiatAmount: number) => string;

export const useFiatFormatter = (shortenFiatValue?: boolean): FiatFormatter => {
  const locale = useSelector(getIntlLocale);
  const fiatCurrency = useSelector(getCurrentCurrency);

  return (fiatAmount: number) => {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: fiatCurrency,
      });

      if (!shortenFiatValue) {
        return formatter.format(fiatAmount);
      }

      const parts = formatter.formatToParts(fiatAmount);

      let currencySymbol = '';
      let numberString = '';

      parts.forEach((part) => {
        if (part.type === 'currency') {
          currencySymbol += part.value;
        } else {
          numberString += part.value;
        }
      });

      // Shorten the number part while preserving commas
      const shortenedNumberString = shortenString(numberString, {
        truncatedCharLimit: TRUNCATED_CHAR_LIMIT_FOR_SHORTENED_FIAT,
        truncatedStartChars: TRUNCATED_START_CHARS_FOR_SHORTENED_FIAT,
        truncatedEndChars: 0,
        skipCharacterInEnd: true,
      });

      // Determine the position of the currency symbol
      const currencyBeforeNumber =
        parts.findIndex((part) => part.type === 'currency') <
        parts.findIndex((part) => part.type === 'integer');

      // Reassemble the formatted string
      return currencyBeforeNumber
        ? `${currencySymbol}${shortenedNumberString}`
        : `${shortenedNumberString}${currencySymbol}`;
    } catch (error) {
      // Fallback for unknown or unsupported currencies
      const formattedNumber = new Intl.NumberFormat(locale).format(fiatAmount);
      const shortenedNumberString = shortenString(formattedNumber, {
        truncatedCharLimit: TRUNCATED_CHAR_LIMIT_FOR_SHORTENED_FIAT,
        truncatedStartChars: TRUNCATED_START_CHARS_FOR_SHORTENED_FIAT,
        truncatedEndChars: 0,
        skipCharacterInEnd: true,
      });

      if (shortenFiatValue) {
        return `${shortenedNumberString} ${fiatCurrency}`;
      }
      return `${formattedNumber} ${fiatCurrency}`;
    }
  };
};
