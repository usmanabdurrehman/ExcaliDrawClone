import { Box, Flex } from "@chakra-ui/react";
import { DrawAction, PAINT_DRAW_OPTIONS } from "../../constants";
import { LockClosed, LockOpen } from "../../icons";
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
        <IconButton
          label={"Lock Canvas"}
          icon={true ? <LockOpen /> : <LockClosed />}
          isSelected
          baseBg="none"
        />
        <Divider />
        {PAINT_DRAW_OPTIONS.map(({ label, icon, id, keyBind }) => (
          <IconButton
            label={label}
            icon={icon}
            keyBind={keyBind}
            isSelected={action === id}
            onClick={() => onChange(id)}
            baseBg="none"
          />
        ))}
      </Flex>
    </Box>
  );
}
