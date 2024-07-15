import {
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import React from "react";
import {
  ARROW_HEADS_OPTIONS,
  BACKGROUND_COLORS,
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
import ColorPicker from "../ColorPicker/ColorPicker";
import ColorSelector from "../ColorSelector/ColorSelector";
import Divider from "../Divider/Divider";
import IconButton from "../IconButton/IconButton";
import OptionsSection from "../OptionsSection/OptionsSection";

export default function Options() {
  return (
    <Box
      borderRadius="md"
      width="200px"
      border="1px solid #ddd"
      p={3}
      bg="white"
      height="100%"
      overflow="auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <OptionsSection header="Stroke" noTopMargin>
        {STROKE_COLORS.map((color, index) => (
          <ColorSelector color={color} />
        ))}
        <Divider />
        <ColorPicker />
      </OptionsSection>
      <OptionsSection header="Background">
        <ColorSelector isTransparent />
        {BACKGROUND_COLORS.map((color, index) => (
          <ColorSelector color={color} />
        ))}
        <Divider />
        <ColorPicker />
      </OptionsSection>
      <OptionsSection header="Font size">
        {FONT_SIZE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Font family">
        {FONT_FAMILY_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Text align">
        {TEXT_ALIGN_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Fill">
        {SHAPE_FILL_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Stroke width">
        {STROKE_WIDTH_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Stroke style">
        {STROKE_STYLE_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Slopiness">
        {SLOPPINESS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Edges">
        {SHAPE_EDGES_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Arrow heads">
        {ARROW_HEADS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Opacity">
        <RangeSlider
          max={1}
          min={0}
          step={0.1}
          defaultValue={[1]}
          borderRadius="md"
        >
          <RangeSliderTrack h={2} borderRadius="md">
            <RangeSliderFilledTrack bg="gray" />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} bg="gray" />
        </RangeSlider>
      </OptionsSection>
      <OptionsSection header="Layers">
        {LAYER_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
      <OptionsSection header="Actions">
        {MISC_ACTIONS_OPTIONS.map(({ id, label, icon }) => (
          <IconButton icon={icon} label={label} />
        ))}
      </OptionsSection>
    </Box>
  );
}
