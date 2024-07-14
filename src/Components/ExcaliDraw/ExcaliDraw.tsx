import { Box } from "@chakra-ui/react";
import React from "react";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    return <Box pos="relative" height="100vh" width="100vw"></Box>;
  }
);
