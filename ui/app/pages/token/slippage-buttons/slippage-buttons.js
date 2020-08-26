import React, { useState, useEffect, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { I18nContext } from '../../../contexts/i18n'
import ButtonGroup from '../../../components/ui/button-group'
import Button from '../../../components/ui/button'
import InfoTooltip from '../../../components/ui/info-tooltip'

export default function SlippageButtons ({
  onSelect,
}) {
  const t = useContext(I18nContext)
  const [open, setOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [enteringCustomValue, setEnteringCustomValue] = useState(false)
  const [activeButtonIndex, setActiveButtonIndex] = useState(1)
  const inputRef = useRef(null)

  let errorText = ''
  if (customValue && Number(customValue) <= 0) {
    errorText = t('swapSlippageTooLow')
  } else if (customValue && Number(customValue) < 0.5) {
    errorText = t('swapLowSlippageError')
  } else if (customValue && Number(customValue) > 5) {
    errorText = t('swapHighSlippageWarning')
  }

  const customValueText = customValue ? `${customValue}%` : t('swapCustom')

  useEffect(() => {
    if (inputRef?.current && enteringCustomValue && window.document.activeElement !== inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef, enteringCustomValue])

  return (
    <div className="slippage-buttons">
      <div
        onClick={() => setOpen(!open)}
        className={classnames('slippage-buttons__header', {
          'slippage-buttons__header--open': open,
        })}
      >
        <div className="slippage-buttons__header-text">{t('swapsAdvancedOptions')}</div>
        {open ? <i className="fa fa-angle-up" /> : <i className="fa fa-angle-down" />}
      </div>
      {open && (
        <div className="slippage-buttons__dropdown-content">
          <div className="slippage-buttons__buttons-prefix">
            <div className="slippage-buttons__prefix-text">{t('swapsMaxSlippage')}</div>
            <InfoTooltip
              position="top"
              contentText={t('swapAdvancedSlippageInfo')}
            />
          </div>
          <ButtonGroup
            className="radio-button-group"
            activeClass="radio-button-group radio-button--active"
            defaultActiveButtonIndex={1}
            newActiveButtonIndex={activeButtonIndex}
          >
            <Button
              className="radio-button-group radio-button"
              onClick={() => {
                setCustomValue('')
                setEnteringCustomValue(false)
                onSelect(1)
              }}
            >
              1%
            </Button>
            <Button
              className="radio-button-group radio-button"
              onClick={() => {
                setCustomValue(undefined)
                setEnteringCustomValue(false)
                onSelect(2)
              }}
            >
              2%
            </Button>
            <Button
              className={classnames('radio-button-group radio-button', 'slippage-buttons__custom-button', {
                'radio-button--danger': errorText,
              })}
              onClick={() => {
                setActiveButtonIndex(2)
                setEnteringCustomValue(true)
              }}
            >
              {(enteringCustomValue
                ? (
                  <div
                    className={classnames('slippage-buttons__custom-input', {
                      'slippage-buttons__custom-input--danger': errorText,
                    })}
                  >
                    <input
                      onChange={(event) => {
                        setCustomValue(event.target.value)
                        onSelect(event.target.value)
                      }}
                      type="number"
                      step="0.1"
                      ref={inputRef}
                      onBlur={() => {
                        setEnteringCustomValue(false)
                        customValue === '' && setActiveButtonIndex(1)
                      }}
                      value={customValue}
                    />
                  </div>
                )
                : customValueText
              )}
            </Button>
          </ButtonGroup>
        </div>
      )}
      {errorText && (
        <div className="slippage-buttons__error-text">
          { errorText }
        </div>
      )}
    </div>
  )
}

SlippageButtons.propTypes = {
  onSelect: PropTypes.func.isRequired,
}
