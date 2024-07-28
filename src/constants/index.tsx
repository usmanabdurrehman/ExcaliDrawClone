import { ArrowUpRight, PenFill } from "react-bootstrap-icons";

export enum DrawAction {
  Crown = "crown",
  Line = "line",
  Rectangle = "rectangle",
  Select = "select",
  Scribble = "scribble",
}

export const DRAW_OPTIONS = [
  {
    id: DrawAction.Crown,
    icon: (
      <img
        src={
          "https://static.vecteezy.com/system/resources/previews/020/937/209/non_2x/crown-icon-for-your-website-design-logo-app-ui-free-vector.jpg"
        }
        width="24px"
        height="24px"
      />
    ),
  },
  {
    id: DrawAction.Scribble,
    icon: (
      <img
        src={"https://www.svgrepo.com/show/438239/image-scribble-icon.svg"}
        width="24px"
        height="24px"
      />
    ),
  },
  {
    id: DrawAction.Line,
    icon: <PenFill />,
  },
  {
    id: DrawAction.Select,
    icon: <ArrowUpRight />,
  },
];

export const MULTI_POINT_LINE_BG = "#a5d8ff";
export const SCRIBBLE_BG = "#a5d8ff";
export const STROKE_COLOR = "#000";
