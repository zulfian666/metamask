import React, { useContext } from 'react';
import classnames from 'classnames';
import { SelectContext } from '../select-wrapper';
import type { PolymorphicRef } from '../box';
import { Box, Icon, IconName, IconSize, Label, Text } from '..';
import type { TextProps } from '../text';
import {
  AlignItems,
  BackgroundColor,
  BlockSize,
  BorderColor,
  BorderRadius,
  Display,
  JustifyContent,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import {
  SelectButtonProps,
  SelectButtonComponent,
  SelectButtonSize,
} from './select-button.types';
import { de } from './.storybook/locales';

// Utility function to check for plain objects
const isPlainObject = (obj: any) => {
  return (
    Boolean(obj) &&
    typeof obj === 'object' &&
    obj.constructor === Object &&
    !React.isValidElement(obj)
  );
};

export const SelectButton: SelectButtonComponent = React.forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      className = '',
      placeholder: placeholderProp,
      children,
      size = SelectButtonSize.Md,
      isBlock,
      isDanger: isDangerProp,
      isDisabled: isDisabledProp,
      startAccessory,
      endAccessory,
      title,
      description,
      caretIconProps,
      value: valueProp,
      uncontrolledValue: uncontrolledValueProp,
      defaultValue: defaultValueProp,
      ...props
    }: SelectButtonProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const selectContext = useContext(SelectContext);
    const isWithinSelectWrapper = Boolean(selectContext);

    const {
      isOpen = false, // Default values for when not in SelectWrapper
      isUncontrolledOpen = false,
      toggleUncontrolledOpen,
      isDanger = false,
      isDisabled = false,
      value = '',
      uncontrolledValue = '',
      defaultValue = '',
      placeholder = '',
    } = selectContext || {};

    const contentToRender =
      valueProp ||
      uncontrolledValueProp ||
      defaultValueProp ||
      value ||
      uncontrolledValue ||
      defaultValue ||
      placeholderProp ||
      placeholder ||
      children;

    let titleRender = title;
    let descriptionRender = description;
    let startAccessoryRender = startAccessory;
    let endAccessoryRender = endAccessory;

    const contentIsPlainObject = isPlainObject(contentToRender);

    if (contentIsPlainObject) {
      if (contentToRender.title) {
        titleRender = contentToRender.title;
      }
      if (contentToRender.description) {
        descriptionRender = contentToRender.description;
      }
      if (contentToRender.startAccessory) {
        startAccessoryRender = contentToRender.startAccessory;
      }
      if (contentToRender.endAccessory) {
        endAccessoryRender = contentToRender.endAccessory;
      }
    }

    const getPaddingBySize = () => {
      switch (size) {
        case SelectButtonSize.Sm:
          return 1;
        case SelectButtonSize.Md:
          return 2;
        case SelectButtonSize.Lg:
          return 3;
        default:
          return 1;
      }
    };

    return (
      <Text
        className={classnames(
          'mm-select-button',
          {
            'mm-select-button--type-danger':
              Boolean(isDanger) || Boolean(isDangerProp),
            'mm-select-button--disabled':
              Boolean(isDisabled) || Boolean(isDisabledProp),
            'mm-select-button--block': Boolean(isBlock),
            'mm-select-button--open':
              Boolean(isOpen) || Boolean(isUncontrolledOpen),
            [`mm-select-button--size-${size}`]:
              Object.values(SelectButtonSize).includes(size),
          },
          className,
        )}
        ref={ref}
        disabled={isDisabled || isDisabledProp}
        as="button"
        onClick={isWithinSelectWrapper ? toggleUncontrolledOpen : undefined}
        borderColor={BorderColor.borderDefault}
        borderRadius={BorderRadius.MD}
        backgroundColor={BackgroundColor.backgroundDefault}
        paddingTop={getPaddingBySize()}
        paddingBottom={getPaddingBySize()}
        paddingLeft={4}
        paddingRight={4}
        display={Display.InlineFlex}
        height={BlockSize.Full}
        alignItems={AlignItems.center}
        justifyContent={JustifyContent.spaceBetween}
        gap={2}
        {...(props as TextProps<C>)}
      >
        <Box display={Display.Flex} alignItems={AlignItems.center} gap={2}>
          {startAccessoryRender}
          <div style={{ background: 'lightblue', flex: 1 }}>
            {titleRender && <Label ellipsis>{titleRender}</Label>}
            {descriptionRender && (
              <Text
                variant={TextVariant.bodySm}
                color={TextColor.textAlternative}
                ellipsis
              >
                {descriptionRender}
              </Text>
            )}
            {!contentIsPlainObject && contentToRender}
          </div>
          {endAccessoryRender}
        </Box>
        <Icon
          name={IconName.ArrowDown}
          size={IconSize.Sm}
          {...caretIconProps}
        />
      </Text>
    );
  },
);
