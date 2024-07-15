import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface OptionsSectionProps {
  children: React.ReactNode;
  header: string;
  noTopMargin?: boolean;
}

export default function OptionsSection({
  children,
  header,
  noTopMargin,
}: OptionsSectionProps) {
  return (
    <Box mt={noTopMargin ? 0 : 3}>
      <Text fontSize="x-small">{header}</Text>
      <Flex mt={1} gap={1}>
        {children}
      </Flex>
    </Box>
  );
}
