import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Portal,
  Box,
} from "@chakra-ui/react";
import { CANVAS_BG_COLORS, MenuOption, MENU_OPTIONS } from "../../constants";
import { Hamburger } from "../../icons";
import { ColorPicker } from "../ColorPicker";
import ColorSelector from "../ColorSelector/ColorSelector";
import { Divider } from "../Divider";
import { OptionSection } from "../OptionSection";

interface MenuProps {
  onAction: (action: MenuOption) => void;
}

export default function MenuBtn({ onAction }: MenuProps) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Hamburger />}
        variant="outline"
        bg="#ececf4"
        size="sm"
      />
      <Portal>
        <MenuList fontSize="x-small" width={"200px"} minWidth="auto">
          {MENU_OPTIONS.map(({ id, label, keyBind, icon }) => (
            <MenuItem
              icon={icon}
              command={keyBind}
              onClick={() => onAction(id)}
            >
              {label}
            </MenuItem>
          ))}
          <Box pl={2}>
            <OptionSection header="Canvas Background">
              {CANVAS_BG_COLORS.map((color) => (
                <ColorSelector color={color} />
              ))}
              <Divider />
              <ColorPicker />
            </OptionSection>
          </Box>
        </MenuList>
      </Portal>
    </Menu>
  );
}
