import { Box, Flex } from "@chakra-ui/react";
import { DrawAction, PAINT_DRAW_OPTIONS } from "../../constants";
import { Divider } from "../Divider";
import { IconButton } from "../IconButton";

interface ActionButtonProps {
  onChange: React.Dispatch<React.SetStateAction<DrawAction>>;
  action: DrawAction | undefined;
}

export default function ActionButtons({ action, onChange }: ActionButtonProps) {
  return (
    <Box
      display="inline-block"
      boxShadow="md"
      border="1px solid #eee"
      borderRadius="md"
      p={1}
      bg="white"
    >
      <Flex gap={2} alignItems="center">
        {PAINT_DRAW_OPTIONS.map(({ label, icon, id, keyBind, selectedIcon }) =>
          id === DrawAction.Divider ? (
            <Divider />
          ) : (
            <IconButton
              label={label || ""}
              icon={
                (action === id && selectedIcon
                  ? selectedIcon
                  : icon) as JSX.Element
              }
              keyBind={keyBind}
              isSelected={action === id}
              onClick={() => onChange(id)}
              baseBg="none"
            />
          )
        )}
      </Flex>
    </Box>
  );
}
