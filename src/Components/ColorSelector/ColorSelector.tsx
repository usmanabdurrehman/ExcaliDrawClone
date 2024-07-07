import { Box } from "@chakra-ui/react";
import React from "react";

interface ColorSelectorProps {
  isTransparent?: boolean;
  color?: string;
  isSelected?: boolean;
}

export default function ColorSelector({
  isTransparent,
  color,
  isSelected,
}: ColorSelectorProps) {
  return (
    <Box
      h={6}
      w={6}
      borderRadius="md"
      cursor="pointer"
      bg={color}
      {...(isTransparent && { backgroundImage: "url(./transparentFill.png)" })}
      border="1px solid #d6d6d6"
      role="group"
      pos="relative"
    >
      <Box
        {...(isSelected
          ? {
              border: "1px solid #4a47b1",
            }
          : {
              border: "1px solid #aaa",
              display: "none",
              _groupHover: { display: "block" },
            })}
        pos="absolute"
        borderRadius="md"
        top={"-3px"}
        left={"-3px"}
        height={`calc(100% + 6px)`}
        width={`calc(100% + 6px)`}
      ></Box>
    </Box>
  );
}
