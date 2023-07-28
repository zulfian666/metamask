import React, { useRef, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import {
  BlockSize,
  Display,
  JustifyContent,
} from '../../../helpers/constants/design-system';
import { Box } from '..';

import type { PolymorphicRef, BoxProps } from '../box';

import { HeaderBaseProps, HeaderBaseComponent } from './header-base.types';

export const HeaderBase: HeaderBaseComponent = React.forwardRef(
  <C extends React.ElementType = 'span'>(
    {
      startAccessory,
      endAccessory,
      className = '',
      children,
      childrenWrapperProps,
      startAccessoryWrapperProps,
      endAccessoryWrapperProps,
      ...props
    }: HeaderBaseProps<C>,
    ref?: PolymorphicRef<C>,
  ) => {
    const startAccessoryRef = useRef<HTMLDivElement>(null);
    const endAccessoryRef = useRef<HTMLDivElement>(null);
    const [accessoryMinWidth, setAccessoryMinWidth] = useState<number>();

    useEffect(() => {
      function handleResize() {
        if (startAccessoryRef.current && endAccessoryRef.current) {
          const accMinWidth = Math.max(
            startAccessoryRef.current.scrollWidth,
            endAccessoryRef.current.scrollWidth,
          );
          setAccessoryMinWidth(accMinWidth);
        } else if (startAccessoryRef.current && !endAccessoryRef.current) {
          setAccessoryMinWidth(startAccessoryRef.current.scrollWidth);
        } else if (!startAccessoryRef.current && endAccessoryRef.current) {
          setAccessoryMinWidth(endAccessoryRef.current.scrollWidth);
        } else {
          setAccessoryMinWidth(0);
        }
      }

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [startAccessoryRef, endAccessoryRef, children]);

    const getTitleStyles = useMemo(() => {
      if (startAccessory && !endAccessory) {
        return {
          marginRight: `${accessoryMinWidth}px`,
        };
      } else if (!startAccessory && endAccessory) {
        return {
          marginLeft: `${accessoryMinWidth}px`,
        };
      }
      return {};
    }, [accessoryMinWidth, startAccessory, endAccessory]);

    return (
      <Box
        className={classnames('mm-header-base', className)}
        ref={ref}
        display={Display.Flex}
        justifyContent={JustifyContent.spaceBetween}
        {...(props as BoxProps<C>)}
      >
        {startAccessory && (
          <Box
            ref={startAccessoryRef}
            style={
              children
                ? {
                    minWidth: `${accessoryMinWidth}px`,
                  }
                : undefined
            }
            {...(startAccessoryWrapperProps as BoxProps<C>)}
          >
            {startAccessory}
          </Box>
        )}
        {children && (
          <Box
            width={BlockSize.Full}
            style={getTitleStyles}
            {...(childrenWrapperProps as BoxProps<C>)}
          >
            {children}
          </Box>
        )}
        {endAccessory && (
          <Box
            display={Display.Flex}
            justifyContent={JustifyContent.flexEnd}
            ref={endAccessoryRef}
            style={
              children
                ? {
                    minWidth: `${accessoryMinWidth}px`,
                  }
                : undefined
            }
            {...(endAccessoryWrapperProps as BoxProps<C>)}
          >
            {endAccessory}
          </Box>
        )}
      </Box>
    );
  },
);
