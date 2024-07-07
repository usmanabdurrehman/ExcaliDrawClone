import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface OptionSectionProps {
  children: React.ReactNode;
  header: string;
  noTopMargin?: boolean;
}

export default function OptionSection({
  header,
  children,
  noTopMargin,
}: OptionSectionProps) {
  return (
    <Box mt={noTopMargin ? 0 : 3}>
      <Text fontSize="x-small">{header}</Text>
      <Flex mt={1} gap={1}>
        {children}
      </Flex>
    </Box>
  );
}
