import { Box, IconButton as ChakraIconButton, Text } from "@chakra-ui/react";
import React from "react";
import { ICON_FILL_COLOR } from "../../constants";

export const IconButton = ({
  icon,
  isSelected,
  keyBind,
  label,
  onClick,
  baseBg,
}: {
  icon: JSX.Element;
  isSelected?: boolean;
  keyBind?: string;
  label: string;
  onClick?: () => void;
  baseBg?: string;
}) => {
  return (
    <Box pos="relative">
      <ChakraIconButton
        aria-label={label}
        title={label}
        icon={React.cloneElement(icon, { isSelected })}
        size="sm"
        fontSize="xs"
        bg={isSelected ? "#e0dfff" : baseBg}
        color={isSelected ? ICON_FILL_COLOR : "black"}
        transition={"none"}
        onClick={onClick}
      />
      {keyBind && (
        <Text
          fontSize="xx-small"
          pos="absolute"
          bottom="2px"
          right="3px"
          color={isSelected ? "#4440bf" : "#aaa"}
        >
          {keyBind}
        </Text>
      )}
    </Box>
  );
};
