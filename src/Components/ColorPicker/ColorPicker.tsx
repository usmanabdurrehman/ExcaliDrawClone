import React from "react";
import {
  Box,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";

const color = "black";

export default function ColorPicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Box bg={color} h={6} w={6} borderRadius="md" cursor="pointer"></Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent width="300">
          <SketchPicker onChangeComplete={() => {}} />
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
