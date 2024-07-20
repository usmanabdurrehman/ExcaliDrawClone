import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import { Node, NodeConfig } from "konva/lib/Node";
import {
  ARROW_HEADS_OPTIONS,
  BACKGROUND_COLORS,
  DrawAction,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LayerOptions,
  LAYER_OPTIONS,
  MiscActions,
  MISC_ACTIONS_OPTIONS,
  ShapeEdges,
  SHAPE_EDGES_OPTIONS,
  SHAPE_FILL_OPTIONS,
  SLOPPINESS_OPTIONS,
  StrokeStyle,
  StrokeWidth,
  STROKE_COLORS,
  STROKE_STYLE_OPTIONS,
  STROKE_WIDTH_OPTIONS,
  TEXT_ALIGN_OPTIONS,
} from "../../constants";
import { ColorPicker } from "../ColorPicker";
import ColorSelector from "../ColorSelector/ColorSelector";
import { Divider } from "../Divider";
import { IconButton } from "../IconButton";
import { OptionSection } from "../OptionSection";

interface OptionsProps {
  onAction: (action: MiscActions) => void;
  onShapeAction: (payload: any) => void;
  onLayerChange: (action: LayerOptions) => void;
  nodeAttrs: NodeConfig | undefined;
  type: DrawAction;
}

export default function Options({
  onAction,
  onShapeAction,
  nodeAttrs,
  type,
  onLayerChange,
}: OptionsProps) {
  const isShape = [
    DrawAction.Circle,
    DrawAction.Diamond,
    DrawAction.Rectangle,
  ].includes(type);

  const hasEdges = [DrawAction.Diamond, DrawAction.Rectangle].includes(type);

  const isText = type === DrawAction.Text;
  const isArrow = type === DrawAction.Arrow;

  return (
    <Box
      borderRadius={"md"}
      width="200px"
      border="1px solid #ddd"
      p={3}
      bg="white"
      height="100%"
      overflow="auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <OptionSection header="Stroke" noTopMargin>
        {STROKE_COLORS.map((color) => (
          <ColorSelector
            color={color}
            onClick={() => onShapeAction({ stroke: color })}
            isSelected={color === nodeAttrs?.stroke}
          />
        ))}
        <Divider />
        <ColorPicker
          color={nodeAttrs?.stroke}
          onChange={(color) => onShapeAction({ stroke: color })}
        />
      </OptionSection>

      {isShape && (
        <OptionSection header="Background">
          <ColorSelector
            isTransparent
            onClick={() => onShapeAction({ fill: undefined })}
          />
          {BACKGROUND_COLORS.map((color) => (
            <ColorSelector
              color={color}
              onClick={() => onShapeAction({ fill: color })}
              isSelected={color === nodeAttrs?.fill}
            />
          ))}
          <Divider />
          <ColorPicker
            color={nodeAttrs?.fill}
            onChange={(color) => onShapeAction({ fill: color })}
          />
        </OptionSection>
      )}

      {isText && (
        <>
          <OptionSection header="Font size">
            {FONT_SIZE_OPTIONS.map(({ id, label, icon }) => (
              <IconButton label={label} icon={icon} />
            ))}
          </OptionSection>

          <OptionSection header="Font family">
            {FONT_FAMILY_OPTIONS.map(({ id, label, icon }) => (
              <IconButton label={label} icon={icon} />
            ))}
          </OptionSection>

          <OptionSection header="Text align">
            {TEXT_ALIGN_OPTIONS.map(({ id, label, icon }) => (
              <IconButton label={label} icon={icon} />
            ))}
          </OptionSection>
        </>
      )}

      <OptionSection header="Fill">
        {SHAPE_FILL_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Stroke width">
        {STROKE_WIDTH_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={id === (nodeAttrs?.strokeWidth || StrokeWidth.Bold)}
            onClick={() => onShapeAction({ strokeWidth: id })}
          />
        ))}
      </OptionSection>

      <OptionSection header="Stroke style">
        {STROKE_STYLE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            isSelected={
              id === (nodeAttrs?.dash?.join(" ") || StrokeStyle.Solid)
            }
            onClick={() => onShapeAction({ dash: id.split(" ") })}
          />
        ))}
      </OptionSection>

      <OptionSection header="Sloppiness">
        {SLOPPINESS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      {hasEdges && (
        <OptionSection header="Edges">
          {SHAPE_EDGES_OPTIONS.map(({ id, label, icon }) => (
            <IconButton
              label={label}
              icon={icon}
              isSelected={id === (nodeAttrs?.cornerRadius || ShapeEdges.Sharp)}
              onClick={() => onShapeAction({ cornerRadius: id })}
            />
          ))}
        </OptionSection>
      )}

      {isArrow && (
        <OptionSection header="Arrowheads">
          {ARROW_HEADS_OPTIONS.map(({ id, label, icon }) => (
            <IconButton label={label} icon={icon} />
          ))}
        </OptionSection>
      )}

      <OptionSection header="Opacity">
        <RangeSlider
          mt={1}
          max={1}
          min={0}
          aria-label={["min", "max"]}
          value={[nodeAttrs?.opacity || 1]}
          borderRadius="md"
          step={0.1}
          onChange={(opacity) => onShapeAction({ opacity })}
        >
          <RangeSliderTrack h={2} borderRadius="md">
            <RangeSliderFilledTrack bg="gray" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} bg="gray" />
        </RangeSlider>
      </OptionSection>

      <OptionSection header="Layers">
        {LAYER_OPTIONS.map(({ id, label, icon }) => (
          <IconButton
            label={label}
            icon={icon}
            onClick={() => onLayerChange(id)}
          />
        ))}
      </OptionSection>
      <OptionSection header="Actions">
        {MISC_ACTIONS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} onClick={() => onAction(id)} />
        ))}
      </OptionSection>
    </Box>
  );
}
