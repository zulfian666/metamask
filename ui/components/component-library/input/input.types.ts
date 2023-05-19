import { BoxProps } from 'ui/components/ui/box/box';

import {
  TextVariant
} from '../../../helpers/constants/design-system';

export enum InputType {
  Text = 'text',
  Number = 'number',
  Password = 'password',
  Search = 'search',
}

export interface InputProps extends BoxProps {
  /**
   * Autocomplete allows the browser to predict the value based on earlier typed values
   */
  autoComplete?: boolean,
  /**
   * If `true`, the input will be focused during the first mount.
   */
  autoFocus?: boolean,
  /**
   * An additional className to apply to the input
   */
  className?:string,
  /**
   * The default input value, useful when not controlling the component.
   */
  defaultValue?: string | number,
  /**
   * If `true`, the input will be disabled.
   */
  disabled?: boolean,
  /**
   * Disables focus state by setting CSS outline: none;
   * !!IMPORTANT!!
   * If this is set to true ensure there is a proper fallback
   * to enable accessibility for keyboard only and vision impaired users
   */
  disableStateStyles?: boolean,
  /**
   * If `true`, aria-invalid will be true
   */
  error?: boolean,
  /**
   * The id of the `input` element.
   */
  id?: string,
  /**
   * Max number of characters to allow
   */
  maxLength?: number,
  /**
   * Name attribute of the `input` element.
   */
  name?: string,
  /**
   * Callback fired on blur
   */
  onBlur?: (...args: any[]) => any,
  /**
   * Callback fired when the value is changed.
   */
  onChange?: (...args: any[]) => any,
  /**
   * Callback fired on focus
   */
  onFocus?: (...args: any[]) => any,
  /**
   * The short hint displayed in the input before the user enters a value.
   */
  placeholder?: string,
  /**
   * It prevents the user from changing the value of the field (not from interacting with the field).
   */
  readOnly?: boolean,
  /**
   * If `true`, the input will be required. Currently no visual difference is shown.
   */
  required?: boolean,
  /**
   * Use this to override the text variant of the Text component.
   * Should only be used for approved custom input components
   * Use the TextVariant enum
   */
  textVariant?: TextVariant,
  /**
   * Type of the input element. Can be InputType.Text, InputType.Password, InputType.Number
   * Defaults to InputType.Text ('text')
   * If you require another type add it to InputType
   */
  type?: InputType,
  /**
   * The input value, required for a controlled component.
   */
  value?: string | number,
  /**
   * Input accepts all the props from Box
   */
};