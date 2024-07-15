import React from "react";

import { Box, IconButton as ChakraUIIconButton, Text } from "@chakra-ui/react";
import { ICON_FILL_COLOR } from "../../constants";

interface IconButtonProps {
  icon: JSX.Element;
  isSelected?: boolean;
  keyBind?: string;
  label: string;
  onClick?: () => void;
  baseBg?: string;
}

export default function IconButton({
  icon,
  isSelected,
  keyBind,
  label,
  onClick,
  baseBg,
}: IconButtonProps) {
  return (
    <Box pos="relative">
      <ChakraUIIconButton
        aria-label={label}
        title={label}
        icon={React.cloneElement(icon, { isSelected })}
        size="sm"
        fontSize="xs"
        bg={isSelected ? "#e0dfff" : baseBg}
        color={isSelected ? ICON_FILL_COLOR : "black"}
        transition="none"
        onClick={onClick}
      />
      <Text
        pos="absolute"
        bottom="2px"
        right="3px"
        fontSize={"xx-small"}
        color={isSelected ? "#4440bf" : "#aaa"}
      >
        {keyBind}
      </Text>
    </Box>
  );
}
