import { JSXElement, TextElement } from '@metamask/snaps-sdk/jsx';
import { getJsxChildren } from '@metamask/snaps-utils';
import { NonEmptyArray } from '@metamask/utils';
import { mapTextToTemplate } from '../utils';
import {
  TextVariant,
  OverflowWrap,
  TextColor,
} from '../../../../../helpers/constants/design-system';
import { UIComponentFactory } from './types';

export const text: UIComponentFactory<TextElement> = ({
  element,
  ...params
}) => ({
  element: 'Text',
  children: mapTextToTemplate(
    getJsxChildren(element) as NonEmptyArray<string | JSXElement>,
    params,
  ),
  props: {
    variant: TextVariant.bodyMd,
    overflowWrap: OverflowWrap.Anywhere,
    color: TextColor.inherit,
    className: 'snap-ui-renderer__text',
  },
});
