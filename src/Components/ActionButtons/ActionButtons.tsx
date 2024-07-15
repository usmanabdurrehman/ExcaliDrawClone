import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { DrawAction, PAINT_DRAW_OPTIONS } from "../../constants";
import Divider from "../Divider/Divider";
import IconButton from "../IconButton/IconButton";

export default function ActionButtons() {
  return (
    <Box
      display="inline-block"
      boxShadow={"md"}
      border="1px solid #eee"
      borderRadius="md"
      p={1}
      bg="white"
    >
      <Flex gap={2} alignItems="center">
        {PAINT_DRAW_OPTIONS.map(
          ({ icon, selectedIcon, id, label, keyBind }, index) =>
            id === DrawAction.Divider ? (
              <Divider />
            ) : (
              <IconButton
                label={label || ""}
                keyBind={keyBind}
                baseBg="none"
                onClick={() => {}}
                isSelected={!index}
                icon={(selectedIcon ? selectedIcon : icon) as JSX.Element}
              />
            )
        )}
      </Flex>
    </Box>
  );
}
