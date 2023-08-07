import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import classnames from 'classnames';

import {
  Display,
  AlignItems,
  BorderRadius,
  BackgroundColor,
} from '../../../helpers/constants/design-system';

import { Box, Input } from '..';

import { BoxProps, PolymorphicRef } from '../box';
import { InputProps } from '../input';
import {
  TextFieldComponent,
  TextFieldProps,
  TextFieldSize,
  TextFieldType,
} from './text-field.types';

export const TextField: TextFieldComponent = React.forwardRef(
  <C extends React.ElementType = 'input'>(
    {
      autoComplete,
      autoFocus,
      className = '',
      defaultValue,
      disabled,
      error,
      id,
      inputProps,
      inputRef,
      startAccessory,
      endAccessory,
      maxLength,
      name,
      onBlur,
      onChange,
      onClick,
      onFocus,
      placeholder,
      readOnly,
      required,
      size = TextFieldSize.Md,
      testId,
      type = TextFieldType.Text,
      truncate = true,
      value,
      InputComponent = Input,
      ...props
    }: TextFieldProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
      // The blur won't fire when the disabled state is set on a focused input.
      // We need to set the focused state manually.
      if (disabled) {
        setFocused(false);
      }
    }, [disabled]);

    const handleClick = (event: KeyboardEvent<HTMLInputElement>) => {
      const { current } = internalInputRef;

      if (current) {
        current.focus();
        setFocused(true);
      }

      if (onClick && !disabled) {
        onClick(event);
      }
    };

    const handleFocus = (event: KeyboardEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event) => {
      setFocused(false);
      onBlur?.(event);
    };

    const handleInputRef = (ref) => {
      internalInputRef.current = ref;
      if (inputRef && inputRef.current !== undefined) {
        inputRef.current = ref;
      } else if (typeof inputRef === 'function') {
        inputRef(ref);
      }
    };

    return (
      <Box
        ref={ref}
        className={classnames(
          'mm-text-field',
          `mm-text-field--size-${size}`,
          {
            'mm-text-field--focused': focused && !disabled,
            'mm-text-field--error': Boolean(error),
            'mm-text-field--disabled': Boolean(disabled),
            'mm-text-field--truncate': truncate,
          },
          className,
        )}
        display={Display.InlineFlex}
        backgroundColor={BackgroundColor.backgroundDefault}
        alignItems={AlignItems.center}
        borderWidth={1}
        borderRadius={BorderRadius.SM}
        paddingLeft={startAccessory ? 4 : 0}
        paddingRight={endAccessory ? 4 : 0}
        onClick={handleClick}
        {...(props as BoxProps<C>)}
      >
        {startAccessory}
        <InputComponent
          aria-invalid={error}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          backgroundColor={BackgroundColor.transparent}
          data-testid={testId}
          defaultValue={defaultValue}
          disabled={disabled}
          focused={focused.toString()}
          id={id}
          margin={0}
          maxLength={maxLength}
          name={name}
          onBlur={handleBlur}
          onChange={onChange}
          onFocus={handleFocus}
          padding={0}
          paddingLeft={startAccessory ? 2 : 4}
          paddingRight={endAccessory ? 2 : 4}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={handleInputRef}
          required={required}
          value={value}
          type={type}
          disableStateStyles
          {...(inputProps as InputProps<C>)} // before className so input className isn't overridden
          className={classnames(
            'mm-text-field__input',
            inputProps?.className ?? '',
          )}
        />
        {endAccessory}
      </Box>
    );
  },
);
