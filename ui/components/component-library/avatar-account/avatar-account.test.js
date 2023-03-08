/* eslint-disable jest/require-top-level-describe */
import { render } from '@testing-library/react';
import React from 'react';
import { AvatarAccount, AvatarAccountSize, AvatarAccountVariant } from '.';
import 'jest-canvas-mock';

describe('AvatarAccount', () => {
  it('should render correctly', () => {
    const { getByTestId, container } = render(
      <AvatarAccount
        data-testid="avatar-account"
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
      />,
    );
    expect(getByTestId('avatar-account')).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  it('should render Jazzicon correctly', () => {
    const { container } = render(
      <AvatarAccount
        data-testid="avatar-account"
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        variant={AvatarAccountVariant.Jazzicon}
      />,
    );
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('should render Blockie correctly', () => {
    const { container } = render(
      <AvatarAccount
        data-testid="avatar-account"
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        variant={AvatarAccountVariant.Blockie}
      />,
    );
    expect(container.querySelector('canvas')).toBeDefined();
    expect(container.querySelector('img')).toBeDefined();
  });

  it('should render with custom classname', () => {
    const { getByTestId } = render(
      <AvatarAccount
        className="mm-avatar-account--test"
        data-testid="classname"
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
      />,
    );
    expect(getByTestId('classname')).toHaveClass('mm-avatar-account--test');
  });

  it('should render with address', () => {
    const container = (
      <AvatarAccount
        className="mm-avatar-account--test"
        data-testid="classname"
        address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
      />
    );
    expect(container.props.address).toStrictEqual(
      '0x5CfE73b6021E818B776b421B1c4Db2474086a7e1',
    );
  });

  it('should render with different size classes', () => {
    const { getByTestId } = render(
      <>
        <AvatarAccount
          size={AvatarAccountSize.Xs}
          data-testid={AvatarAccountSize.Xs}
          address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        />
        <AvatarAccount
          size={AvatarAccountSize.Sm}
          data-testid={AvatarAccountSize.Sm}
          address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        />
        <AvatarAccount
          size={AvatarAccountSize.Md}
          data-testid={AvatarAccountSize.Md}
          address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        />
        <AvatarAccount
          size={AvatarAccountSize.Lg}
          data-testid={AvatarAccountSize.Lg}
          address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        />
        <AvatarAccount
          size={AvatarAccountSize.Xl}
          data-testid={AvatarAccountSize.Xl}
          address="0x5CfE73b6021E818B776b421B1c4Db2474086a7e1"
        />
      </>,
    );
    expect(getByTestId(AvatarAccountSize.Xs)).toHaveClass(
      'mm-avatar-base--size-xs',
    );
    expect(getByTestId(AvatarAccountSize.Sm)).toHaveClass(
      'mm-avatar-base--size-sm',
    );
    expect(getByTestId(AvatarAccountSize.Md)).toHaveClass(
      'mm-avatar-base--size-md',
    );
    expect(getByTestId(AvatarAccountSize.Lg)).toHaveClass(
      'mm-avatar-base--size-lg',
    );
    expect(getByTestId(AvatarAccountSize.Xl)).toHaveClass(
      'mm-avatar-base--size-xl',
    );
  });
});
