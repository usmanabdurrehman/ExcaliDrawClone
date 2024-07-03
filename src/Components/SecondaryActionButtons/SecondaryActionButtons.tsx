import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { SecondaryAction } from "../../constants";
import { Maximize, Minimize, Redo, Undo } from "../../icons";

interface SecondaryActionButtonsProps {}

export default function SecondaryActionButtons({}: SecondaryActionButtonsProps) {
  return (
    <Flex gap={2}>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton aria-label="minimize" icon={<Minimize />} />
        <Button color="#888">100%</Button>
        <IconButton aria-label="maximize" icon={<Maximize />} />
      </ButtonGroup>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton aria-label="undo" icon={<Undo />} title="Undo" />
        <IconButton aria-label="redo" icon={<Redo />} title="Redo" />
      </ButtonGroup>
    </Flex>
  );
}
