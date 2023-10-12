/* eslint-disable jest/require-top-level-describe */
import { render, screen } from '@testing-library/react';
import React from 'react';

import { AvatarGroup } from './avatar-group';

const members = [
  { symbol: 'Eth', image: './images/eth_logo.png' },
  { symbol: 'Matic', image: './images/matic-token.png' },
  { symbol: 'Palm', image: './images/palm.svg' },
  { symbol: 'Avalanche', image: './images/avax-token.png' },
  { symbol: 'Optimism', image: './images/optimism.svg' },
];

describe('AvatarGroup', () => {
  it('should render AvatarGroup component', () => {
    const { getByTestId, container } = render(
      <AvatarGroup members={members} limit={4} />,
    );
    expect(getByTestId('avatar-group')).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  it('should render the tag +1 if members has a length greater than limit', () => {
    render(<AvatarGroup members={members} limit={4} />);

    expect(screen.getByText('+1')).toBeDefined();
  });

  it('should not render the tag if members has a length less than or equal to limit', () => {
    const { queryByText } = render(<AvatarGroup members={members} limit={5} />);
    expect(queryByText('+1')).not.toBeInTheDocument();
  });
});
