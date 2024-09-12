import React, { FunctionComponent, MouseEvent as ReactMouseEvent } from 'react';
import { ButtonVariant, UserInputEventType } from '@metamask/snaps-sdk';
import { useSelector } from 'react-redux';
import { Button, ButtonSize, IconSize } from '../../../component-library';
import {
  AlignItems,
  Display,
  FlexDirection,
} from '../../../../helpers/constants/design-system';
import { useSnapInterfaceContext } from '../../../../contexts/snaps';
import { SnapIcon } from '../snap-icon';
import { getHideSnapBranding } from '../../../../selectors';

type SnapFooterButtonProps = {
  name?: string;
  isSnapAction?: boolean;
  onCancel?: () => void;
};

export const SnapFooterButton: FunctionComponent<SnapFooterButtonProps> = ({
  onCancel,
  name,
  children,
  isSnapAction = false,
  ...props
}) => {
  const { handleEvent, snapId } = useSnapInterfaceContext();
  const hideSnapBranding = useSelector((state) =>
    getHideSnapBranding(state, snapId),
  );

  const handleSnapAction = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault();

    handleEvent({
      event: UserInputEventType.ButtonClickEvent,
      name,
    });
  };

  const handleClick = isSnapAction ? handleSnapAction : onCancel;

  return (
    <Button
      className="snap-footer-button"
      {...props}
      size={ButtonSize.Lg}
      block
      variant={isSnapAction ? ButtonVariant.Primary : ButtonVariant.Secondary}
      onClick={handleClick}
      textProps={{
        display: Display.Flex,
        alignItems: AlignItems.center,
        flexDirection: FlexDirection.Row,
      }}
    >
      {isSnapAction && !hideSnapBranding && (
        <SnapIcon snapId={snapId} avatarSize={IconSize.Sm} marginRight={2} />
      )}
      {children}
    </Button>
  );
};
