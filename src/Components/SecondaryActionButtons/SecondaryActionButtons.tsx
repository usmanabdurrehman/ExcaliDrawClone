import { Button, ButtonGroup, Flex, IconButton } from "@chakra-ui/react";
import { SecondaryAction } from "../../constants";
import { Maximize, Minimize, Redo, Undo } from "../../icons";
import { round } from "../../utilities";

interface SecondaryActionButtonsProps {
  isUndoDisabled: boolean;
  isRedoDisabled: boolean;
  onActionChange: (action: SecondaryAction) => void;
  zoom: number;
}

export default function SecondaryActionButtons({
  isUndoDisabled,
  isRedoDisabled,
  onActionChange,
  zoom,
}: SecondaryActionButtonsProps) {
  return (
    <Flex gap={2}>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton
          aria-label="minimize"
          icon={<Minimize />}
          isDisabled={zoom === 0.1}
          onClick={() => onActionChange(SecondaryAction.ZoomOut)}
        />
        <Button
          color="#888"
          onClick={() => onActionChange(SecondaryAction.ResetZoom)}
        >
          {round(zoom * 100, 0)}%
        </Button>
        <IconButton
          aria-label="maximize"
          icon={<Maximize />}
          onClick={() => onActionChange(SecondaryAction.ZoomIn)}
        />
      </ButtonGroup>
      <ButtonGroup size="sm" isAttached variant="solid">
        <IconButton
          aria-label="undo"
          icon={<Undo />}
          isDisabled={isUndoDisabled}
          onClick={() => onActionChange(SecondaryAction.Undo)}
          title="Undo"
        />
        <IconButton
          aria-label="redo"
          icon={<Redo />}
          isDisabled={isRedoDisabled}
          onClick={() => onActionChange(SecondaryAction.Redo)}
          title="Redo"
        />
      </ButtonGroup>
    </Flex>
  );
}
