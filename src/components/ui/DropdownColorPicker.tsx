/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import * as React from 'react';

import ColorPicker from './ColorPicker';
import DropDown from './DropDown';

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
  currentColor?: string;
  setContextColor?: (color: string) => void;
};

export default function DropdownColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  currentColor,
  setContextColor,
  ...rest
}: Props) {

  useEffect(() => {

   if(color.length > 4 && setContextColor) {
    setContextColor(color)
   }
  }, [color]);
  return (
    <DropDown
      {...rest}
      disabled={disabled}
      stopCloseOnClickSelf={stopCloseOnClickSelf}
      isColored={true}
      color={currentColor}>
      <ColorPicker color={color} onChange={onChange} setContextColor={setContextColor} />
    </DropDown>
  );
}
