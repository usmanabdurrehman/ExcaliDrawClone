import { NodeConfig } from "konva/lib/Node";
import { ICON_FILL_COLOR } from "../constants";

export const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getNumericVal = (val: number | undefined) => val || 0;

export const getIconColorProps = (isSelected: boolean | undefined) => ({
  fill: isSelected ? ICON_FILL_COLOR : "none",
  stroke: isSelected ? ICON_FILL_COLOR : "currentColor",
});

export const reorderArray = <T>(arr: T[], from: number, to: number): T[] => {
  if (to < 0 || to > arr.length - 1) return arr;
  const newArr = [...arr];
  const item = newArr.splice(from, 1);
  newArr.splice(to, 0, item[0]);
  return newArr;
};

export const getRelativePointerPosition = (node: NodeConfig) => {
  // the function will return pointer position relative to the passed node
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we find relative point
  return transform.point(pos);
};

export const resizeBase64Img = ({
  base64,
  width,
  height,
}: {
  base64: string;
  width: number;
  height: number;
}) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext("2d");
    let img = document.createElement("img");
    img.src = base64;
    img.onload = function () {
      context?.scale(width / img.width, height / img.height);
      context?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
};

export const round = (num: number, decimalPlaces: number) => {
  const p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
};
