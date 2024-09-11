import React from 'react';
import configureMockStore from 'redux-mock-store';
import { unapprovedTypedSignMsgV4 } from '../../../../../../test/data/confirmations/typed_sign';
import existingMockState from '../../../../../../test/data/mock-state.json';
import { renderWithProvider } from '../../../../../../test/lib/render-helpers';
import * as ConfirmDucks from '../../../../../ducks/confirm/confirm';
import * as usePreviousHooks from '../../../../../hooks/usePrevious';
import ScrollToBottom from './scroll-to-bottom';

const buttonSelector = '.confirm-scroll-to-bottom__button';

const mockState = {
  ...existingMockState,
  confirm: {
    currentConfirmation: unapprovedTypedSignMsgV4,
  },
};

const mockSetHasScrolledToBottom = jest.fn();

const mockUseScrollRequiredResult = {
  hasScrolledToBottom: false,
  isScrollable: false,
  isScrolledToBottom: false,
  onScroll: jest.fn(),
  scrollToBottom: jest.fn(),
  setHasScrolledToBottom: mockSetHasScrolledToBottom,
  ref: {
    current: {},
  },
};

const mockedUseScrollRequiredResult = jest.mocked(mockUseScrollRequiredResult);

jest.mock('../../../../../hooks/useScrollRequired', () => ({
  useScrollRequired: () => mockedUseScrollRequiredResult,
}));

describe('ScrollToBottom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when content is not scrollable', () => {
    it('renders without button', () => {
      const { container, getByText } = renderWithProvider(
        <ScrollToBottom>
          <div>foo</div>
          <div>bar</div>
        </ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(getByText('foo')).toBeInTheDocument();
      expect(getByText('bar')).toBeInTheDocument();
      expect(container.querySelector(buttonSelector)).not.toBeInTheDocument();
    });

    it('sets isScrollToBottomNeeded to false', () => {
      const updateSpy = jest.spyOn(ConfirmDucks, 'updateConfirm');
      renderWithProvider(
        <ScrollToBottom>foobar</ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(updateSpy).toHaveBeenCalledWith({
        isScrollToBottomNeeded: false,
      });
    });
  });

  describe('when content is scrollable', () => {
    beforeEach(() => {
      mockedUseScrollRequiredResult.isScrollable = true;
    });

    it('renders with button', () => {
      const { container, getByText } = renderWithProvider(
        <div>
          <ScrollToBottom>
            <div>foo</div>
            <div>bar</div>
          </ScrollToBottom>
        </div>,
        configureMockStore([])(mockState),
      );

      expect(getByText('foo')).toBeInTheDocument();
      expect(getByText('bar')).toBeInTheDocument();
      expect(container.querySelector(buttonSelector)).toBeInTheDocument();
    });

    it('sets isScrollToBottomNeeded to true', () => {
      const updateSpy = jest.spyOn(ConfirmDucks, 'updateConfirm');
      renderWithProvider(
        <ScrollToBottom>foobar</ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(updateSpy).toHaveBeenCalledWith({
        isScrollToBottomNeeded: true,
      });
    });

    it('does not scroll to the top while the confirmation id does not change', () => {
      const mockScrollTo = jest.fn();
      const originalScrollTo = window.HTMLDivElement.prototype.scrollTo;
      window.HTMLDivElement.prototype.scrollTo = mockScrollTo;

      jest
        .spyOn(usePreviousHooks, 'usePrevious')
        .mockImplementation(() => unapprovedTypedSignMsgV4.id);

      renderWithProvider(
        <ScrollToBottom>foobar</ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(mockScrollTo).not.toHaveBeenCalled();

      window.HTMLDivElement.prototype.scrollTo = originalScrollTo;
    });

    it('scrolls to the top when the confirmation changes', () => {
      const mockScrollTo = jest.fn();
      const originalScrollTo = window.HTMLDivElement.prototype.scrollTo;
      window.HTMLDivElement.prototype.scrollTo = mockScrollTo;

      renderWithProvider(
        <ScrollToBottom>foobar</ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);

      window.HTMLDivElement.prototype.scrollTo = originalScrollTo;
    });

    it('resets setHasScrolledToBottom to false when the confirmation changes', () => {
      renderWithProvider(
        <ScrollToBottom>foobar</ScrollToBottom>,
        configureMockStore([])(mockState),
      );

      expect(mockSetHasScrolledToBottom).toHaveBeenCalledWith(false);
    });

    describe('when user has scrolled to the bottom', () => {
      beforeEach(() => {
        mockedUseScrollRequiredResult.isScrolledToBottom = true;
      });

      it('hides the button', () => {
        const { container } = renderWithProvider(
          <ScrollToBottom>foobar</ScrollToBottom>,
          configureMockStore([])(mockState),
        );

        expect(container.querySelector(buttonSelector)).not.toBeInTheDocument();
      });

      it('sets isScrollToBottomNeeded to false', () => {
        const updateSpy = jest.spyOn(ConfirmDucks, 'updateConfirm');
        const { container } = renderWithProvider(
          <ScrollToBottom>foobar</ScrollToBottom>,
          configureMockStore([])(mockState),
        );

        expect(container.querySelector(buttonSelector)).not.toBeInTheDocument();
        expect(updateSpy).toHaveBeenCalledWith({
          isScrollToBottomNeeded: true,
        });
      });
    });
  });
});
