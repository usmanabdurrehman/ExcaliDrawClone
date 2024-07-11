import React from "react";
import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const colorVal = color || "black";
  return (
    <Popover>
      <PopoverTrigger>
        <Box bg={colorVal} h={6} w={6} borderRadius="md" cursor="pointer"></Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="300">
          <SketchPicker
            color={colorVal}
            onChangeComplete={(color) => {
              onChange(color.hex);
            }}
          />
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
