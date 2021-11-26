import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import UnitInput from '../unit-input';
import CurrencyDisplay from '../currency-display';
import {
  getValueFromWeiHex,
  getWeiHexFromDecimalValue,
} from '../../../helpers/utils/conversions.util';
import { ETH } from '../../../helpers/constants/common';
import { I18nContext } from '../../../contexts/i18n';

/**
 * Component that allows user to enter currency values as a number, and props receive a converted
 * hex value in WEI. props.value, used as a default or forced value, should be a hex value, which
 * gets converted into a decimal value depending on the currency (ETH or Fiat).
 */
export default function CurrencyInput({
  hexValue,
  preferredCurrency,
  secondaryCurrency,
  hideSecondary,
  featureSecondary,
  conversionRate,
  primarySuffix,
  secondarySuffix,
  onChange,
  onPreferenceToggle,
}) {
  const t = useContext(I18nContext);

  const [isSwapped, setSwapped] = useState(false);
  const [newHexValue, setNewHexValue] = useState(hexValue);

  const shouldUseFiat = () => {
    if (hideSecondary) {
      return false;
    }

    return Boolean(featureSecondary);
  };

  const getDecimalValue = () => {
    const decimalValueString = shouldUseFiat()
      ? getValueFromWeiHex({
          value: hexValue,
          toCurrency: secondaryCurrency,
          conversionRate,
          numberOfDecimals: 2,
        })
      : getValueFromWeiHex({
          value: hexValue,
          toCurrency: ETH,
          numberOfDecimals: 8,
        });

    return Number(decimalValueString) || 0;
  };

  const initialDecimalValue = hexValue ? getDecimalValue() : 0;
  const [decimalValue, setDecimalValue] = useState(initialDecimalValue);

  useEffect(() => {
    setNewHexValue(hexValue);
    const newDecimalValue = getDecimalValue();
    setDecimalValue(newDecimalValue);
  }, [hexValue]);

  const swap = async () => {
    await onPreferenceToggle(!featureSecondary);
    setSwapped(!isSwapped);
  };

  const handleChange = (newDecimalValue) => {
    const hexValueNew = shouldUseFiat()
      ? getWeiHexFromDecimalValue({
          value: newDecimalValue,
          fromCurrency: secondaryCurrency,
          conversionRate,
          invertConversionRate: true,
        })
      : getWeiHexFromDecimalValue({
          value: newDecimalValue,
          fromCurrency: ETH,
          fromDenomination: ETH,
          conversionRate,
        });

    setNewHexValue(hexValueNew);
    setDecimalValue(newDecimalValue);
    onChange(hexValueNew);
    setSwapped(!isSwapped);
  };

  useEffect(() => {
    if (isSwapped) {
      handleChange(decimalValue);
    }
  }, [isSwapped]);

  const renderConversionComponent = () => {
    let currency, numberOfDecimals;

    if (hideSecondary) {
      return (
        <div className="currency-input__conversion-component">
          {t('noConversionRateAvailable')}
        </div>
      );
    }

    if (shouldUseFiat()) {
      // Display ETH
      currency = preferredCurrency || ETH;
      numberOfDecimals = 8;
    } else {
      // Display Fiat
      currency = secondaryCurrency;
      numberOfDecimals = 2;
    }

    return (
      <CurrencyDisplay
        className="currency-input__conversion-component"
        currency={currency}
        value={newHexValue}
        numberOfDecimals={numberOfDecimals}
      />
    );
  };

  return (
    <UnitInput
      {...{
        hexValue,
        preferredCurrency,
        secondaryCurrency,
        hideSecondary,
        featureSecondary,
        conversionRate,
        onChange,
        onPreferenceToggle,
      }}
      suffix={shouldUseFiat() ? secondarySuffix : primarySuffix}
      onChange={handleChange}
      value={decimalValue}
      actionComponent={
        <div className="currency-input__swap-component" onClick={swap} />
      }
    >
      {renderConversionComponent()}
    </UnitInput>
  );
}

CurrencyInput.propTypes = {
  hexValue: PropTypes.string,
  preferredCurrency: PropTypes.string,
  secondaryCurrency: PropTypes.string,
  hideSecondary: PropTypes.bool,
  featureSecondary: PropTypes.bool,
  conversionRate: PropTypes.number,
  primarySuffix: PropTypes.string,
  secondarySuffix: PropTypes.string,
  onChange: PropTypes.func,
  onPreferenceToggle: PropTypes.func,
};
