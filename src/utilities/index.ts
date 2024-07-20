import { NodeConfig } from "konva/lib/Node";

export const getNumericVal = (val: number | undefined) => val || 0;

export const getRelativePointerPosition = (node: NodeConfig) => {
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();

  const pos = node.getStage().getPointerPosition();
  return transform.point(pos);
};
