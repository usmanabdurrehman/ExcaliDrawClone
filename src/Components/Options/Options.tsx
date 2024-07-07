import {
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import {
  ARROW_HEADS_OPTIONS,
  BACKGROUND_COLORS,
  DrawAction,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  LAYER_OPTIONS,
  MISC_ACTIONS_OPTIONS,
  SHAPE_EDGES_OPTIONS,
  SHAPE_FILL_OPTIONS,
  SLOPPINESS_OPTIONS,
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
  type: DrawAction;
}

export default function Options({ type }: OptionsProps) {
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
          <ColorSelector color={color} />
        ))}
        <Divider />
        <ColorPicker />
      </OptionSection>

      <OptionSection header="Background">
        <ColorSelector isTransparent />
        {BACKGROUND_COLORS.map((color) => (
          <ColorSelector color={color} />
        ))}
        <Divider />
        <ColorPicker />
      </OptionSection>

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

      <OptionSection header="Fill">
        {SHAPE_FILL_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Stroke width">
        {STROKE_WIDTH_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Stroke style">
        {STROKE_STYLE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Sloppiness">
        {SLOPPINESS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Edges">
        {SHAPE_EDGES_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Arrowheads">
        {ARROW_HEADS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>

      <OptionSection header="Opacity">
        <RangeSlider
          mt={1}
          max={1}
          min={0}
          aria-label={["min", "max"]}
          defaultValue={[1]}
          borderRadius="md"
          step={0.1}
        >
          <RangeSliderTrack h={2} borderRadius="md">
            <RangeSliderFilledTrack bg="gray" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} bg="gray" />
        </RangeSlider>
      </OptionSection>

      <OptionSection header="Layers">
        {LAYER_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>
      <OptionSection header="Actions">
        {MISC_ACTIONS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton label={label} icon={icon} />
        ))}
      </OptionSection>
    </Box>
  );
}
