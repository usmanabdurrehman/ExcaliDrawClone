import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import ActionButtons from "../ActionButtons/ActionButtons";
import Menu from "../Menu/Menu";
import Options from "../Options/Options";
import SecondarActionButtons from "../SecondaryActionButtons.tsx/SecondarActionButtons";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    return (
      <Box pos="relative" height="100vh" width="100vw">
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          pos="absolute"
          top="20px"
          width="100%"
          pl={4}
          zIndex={1}
        >
          <Menu />
          <ActionButtons />
          <Box />
        </Flex>
        <Box
          zIndex={1}
          pos="absolute"
          top={"90px"}
          left={4}
          height="65vh"
          overflow="auto"
        >
          <Options />
        </Box>
        <Box pos="absolute" left={4} zIndex={1} bottom={"20px"}>
          <SecondarActionButtons />
        </Box>
      </Box>
    );
  }
);
