import React from "react";
import {
  Box,
  IconButton,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { Hamburger } from "../../icons";
import { CANVAS_BG_COLORS, MENU_OPTIONS } from "../../constants";
import OptionsSection from "../OptionsSection/OptionsSection";
import ColorSelector from "../ColorSelector/ColorSelector";
import Divider from "../Divider/Divider";
import ColorPicker from "../ColorPicker/ColorPicker";

export default function Menu() {
  return (
    <ChakraMenu>
      <MenuButton
        as={IconButton}
        aria-label="Menu"
        icon={<Hamburger />}
        variant="outline"
        size="sm"
        bg="#ececf4"
      />
      <Portal>
        <MenuList fontSize="x-small" width="200px" minWidth={"auto"}>
          {MENU_OPTIONS.map(({ id, label, keyBind, icon }) => (
            <MenuItem icon={icon} command={keyBind}>
              {label}
            </MenuItem>
          ))}
          <Box pl={2}>
            <OptionsSection header="Canvas background">
              {CANVAS_BG_COLORS.map((color, index) => (
                <ColorSelector color={color} />
              ))}
              <Divider />
              <ColorPicker />
            </OptionsSection>
          </Box>
        </MenuList>
      </Portal>
    </ChakraMenu>
  );
}
