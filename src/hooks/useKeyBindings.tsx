import { useEffect } from "react";
import { DrawAction } from "../constants";

export const useKeyBindings = ({
  onAction,
  isWritingInProgress,
  onEnter,
}: {
  onAction: (action: DrawAction) => void;
  isWritingInProgress?: boolean;
  onEnter: () => void;
}) => {
  // TODO: To be replaced with useEffectEvent when released
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isWritingInProgress) return;
      e.preventDefault();

      switch (true) {
        case e.key === "Enter": {
          onEnter();
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onAction, isWritingInProgress, onEnter]);
};
