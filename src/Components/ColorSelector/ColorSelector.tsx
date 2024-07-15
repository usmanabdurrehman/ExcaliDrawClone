import { Box } from "@chakra-ui/react";
import React from "react";

interface ColorSelectorProps {
  color?: string;
  isSelected?: string;
  isTransparent?: boolean;
}

export default function ColorSelector({
  color,
  isSelected,
  isTransparent,
}: ColorSelectorProps) {
  return (
    <Box
      h={6}
      w={6}
      borderRadius="md"
      bg={color}
      {...(isTransparent && { backgroundImage: "url(./transparentFill.png)" })}
      cursor={"pointer"}
      border="1px solid #d6d6d6"
      pos="relative"
      role="group"
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
        top="-3px"
        left="-3px"
        height="calc(100% + 6px)"
        width="calc(100% + 6px)"
      ></Box>
    </Box>
  );
}
