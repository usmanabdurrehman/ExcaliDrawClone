import {
  Arrow,
  BoldStrokeWidth,
  Circle,
  DashedStroke,
  DottedStroke,
  Duplicate,
  Eraser,
  Hand,
  Line,
  Link,
  MediumStrokeWidth,
  Pencil,
  Rectangle,
  Select,
  SolidStroke,
  Text,
  ThinStrokeWidth,
  Trash,
  RoundEdges,
  SharpEdges,
  Diamond,
  SendToBack,
  SendBackward,
  SendForward,
  SendToFront,
  FillHachure,
  FillCrossHatch,
  FillSolid,
  AlignLeft,
  AlignRight,
  AlignCenter,
  SloppinessArchitect,
  SloppinessArtist,
  SloppinessCartoonist,
  FontNormal,
  FontCode,
  FontSmall,
  FontMedium,
  FontLarge,
  FontXtraLarge,
  LineHead,
  ArrowHead,
  EditLine,
  Open,
  Save,
  ExportImage,
  Image,
  LockClosed,
  LockOpen,
} from "../icons";

export enum DrawAction {
  Lock = "lock",
  Divider = "divider",
  Move = "move",
  Select = "select",
  Text = "text",
  Rectangle = "rectangle",
  Diamond = "diamond",
  Circle = "circle",
  Scribble = "freedraw",
  Arrow = "arrow",
  Line = "line",
  Eraser = "eraser",
  Image = "Image",
}

export const PAINT_DRAW_OPTIONS = [
  {
    id: DrawAction.Lock,
    label: "Keep selected tool active after drawing--Q",
    icon: <LockOpen />,
    selectedIcon: <LockClosed />,
  },
  { id: DrawAction.Divider },
  {
    id: DrawAction.Move,
    label: "Hand(Panning tool)--H",
    icon: <Hand />,
  },
  {
    id: DrawAction.Select,
    label: "Selection--V or 1",
    icon: <Select />,
    keyBind: "1",
  },
  {
    id: DrawAction.Rectangle,
    label: "Rectangle--R or 2",
    icon: <Rectangle />,
    keyBind: "2",
  },
  {
    id: DrawAction.Diamond,
    label: "Diamond--D or 3",
    icon: <Diamond />,
    keyBind: "3",
  },
  {
    id: DrawAction.Circle,
    label: "Circle--C or 4",
    icon: <Circle />,
    keyBind: "4",
  },
  {
    id: DrawAction.Arrow,
    label: "Arrow--A or 5",
    icon: <Arrow />,
    keyBind: "5",
  },
  { id: DrawAction.Line, label: "Line--L or 6", icon: <Line />, keyBind: "6" },
  {
    id: DrawAction.Scribble,
    label: "Draw--P or 7",
    icon: <Pencil />,
    keyBind: "7",
  },
  { id: DrawAction.Text, label: "Text--T or 8", icon: <Text />, keyBind: "8" },
  {
    id: DrawAction.Image,
    label: "Insert Image 9",
    icon: <Image />,
    keyBind: "9",
  },
  {
    id: DrawAction.Eraser,
    label: "Eraser--E or 0",
    icon: <Eraser />,
    keyBind: "0",
  },
];

export enum FontSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  XtraLarge = "xtraLarge",
}

export const FONT_SIZE_OPTIONS = [
  {
    id: FontSize.Small,
    label: "Small",
    icon: <FontSmall />,
  },
  {
    id: FontSize.Medium,
    label: "Medium",
    icon: <FontMedium />,
  },
  {
    id: FontSize.Large,
    label: "Large",
    icon: <FontLarge />,
  },
  {
    id: FontSize.XtraLarge,
    label: "Xtra Large",
    icon: <FontXtraLarge />,
  },
];

export enum FontFamily {
  HandDrawn = "handDrawn",
  Normal = "normal",
  Code = "code",
}

export const FONT_FAMILY_OPTIONS = [
  {
    id: FontFamily.HandDrawn,
    label: "HandDrawn",
    icon: <Pencil />,
  },
  {
    id: FontFamily.Normal,
    label: "Normal",
    icon: <FontNormal />,
  },
  {
    id: FontFamily.Code,
    label: "Code",
    icon: <FontCode />,
  },
];

enum TextAlign {
  Left = "left",
  Center = "center",
  Right = "right",
}

export const TEXT_ALIGN_OPTIONS = [
  {
    id: TextAlign.Left,
    label: "Left Align",
    icon: <AlignLeft />,
  },
  {
    id: TextAlign.Center,
    label: "Center Align",
    icon: <AlignCenter />,
  },
  {
    id: TextAlign.Right,
    label: "Right Align",
    icon: <AlignRight />,
  },
];

enum ShapeFill {
  Hachure = "Hachure",
  CrossHatch = "CrossHatch",
  Solid = "Solid",
}

export const SHAPE_FILL_OPTIONS = [
  {
    id: ShapeFill.Hachure,
    label: "Hachure",
    icon: <FillHachure />,
  },
  {
    id: ShapeFill.CrossHatch,
    label: "Cross-Hatch",
    icon: <FillCrossHatch />,
  },
  {
    id: ShapeFill.Solid,
    label: "Solid",
    icon: <FillSolid />,
  },
];

export enum StrokeWidth {
  Thin = 1,
  Bold = 2,
  ExtraBold = 4,
}

export const STROKE_WIDTH_OPTIONS = [
  {
    id: StrokeWidth.Thin,
    label: "Thin",
    icon: <ThinStrokeWidth />,
  },
  {
    id: StrokeWidth.Bold,
    label: "Bold",
    icon: <MediumStrokeWidth />,
  },
  {
    id: StrokeWidth.ExtraBold,
    label: "Extra Bold",
    icon: <BoldStrokeWidth />,
  },
];

export enum StrokeStyle {
  Solid = "",
  Dashed = "5 3",
  Dotted = "2 3",
}

export const STROKE_STYLE_OPTIONS = [
  {
    id: StrokeStyle.Solid,
    label: "Solid",
    icon: <SolidStroke />,
  },
  {
    id: StrokeStyle.Dashed,
    label: "Dashed",
    icon: <DashedStroke />,
  },
  {
    id: StrokeStyle.Dotted,
    label: "Dotted",
    icon: <DottedStroke />,
  },
];

export enum Sloppiness {
  Architect = "architect",
  Artist = "artist",
  Cartoonist = "cartoonist",
}

export const SLOPPINESS_OPTIONS = [
  {
    id: Sloppiness.Architect,
    label: "Architect",
    icon: <SloppinessArchitect />,
  },
  {
    id: Sloppiness.Artist,
    label: "Artist",
    icon: <SloppinessArtist />,
  },
  {
    id: Sloppiness.Cartoonist,
    label: "Cartoonist",
    icon: <SloppinessCartoonist />,
  },
];

export enum ShapeEdges {
  Sharp = 0,
  Round = 12,
}

export const SHAPE_EDGES_OPTIONS = [
  {
    id: ShapeEdges.Sharp,
    label: "Sharp",
    icon: <SharpEdges />,
  },
  {
    id: ShapeEdges.Round,
    label: "Round",
    icon: <RoundEdges />,
  },
];

export enum MiscActions {
  Duplicate = "Duplicate",
  Delete = "Delete",
  Link = "Link",
  EditArrow = "EditArrow",
}

export const MISC_ACTIONS_OPTIONS = [
  {
    id: MiscActions.Duplicate,
    label: "Duplicate",
    icon: <Duplicate />,
  },
  {
    id: MiscActions.Delete,
    label: "Delete",
    icon: <Trash />,
  },
  {
    id: MiscActions.Link,
    label: "Link",
    icon: <Link />,
  },
  {
    id: MiscActions.EditArrow,
    label: "Edit Arrow",
    icon: <EditLine />,
  },
];

export enum ArrowHeads {
  Line = "Line",
  Arrow = "Arrow",
}

export const ARROW_HEADS_OPTIONS = [
  {
    id: ArrowHeads.Line,
    label: "Line",
    icon: <LineHead />,
  },
  {
    id: ArrowHeads.Arrow,
    label: "Arrow",
    icon: <ArrowHead />,
  },
];

export enum LayerOptions {
  SendBackward = "sendBackward",
  SendToBack = "sendToBack",
  SendForward = "sendForward",
  SendToFront = "sendToFront",
}

export const LAYER_OPTIONS = [
  {
    id: LayerOptions.SendToBack,
    label: "Send to back",
    icon: <SendToBack />,
  },
  {
    id: LayerOptions.SendBackward,
    label: "Send backward",
    icon: <SendBackward />,
  },
  {
    id: LayerOptions.SendForward,
    label: "Send forward",
    icon: <SendForward />,
  },
  {
    id: LayerOptions.SendToFront,
    label: "Send to front",
    icon: <SendToFront />,
  },
];

export const ICON_FILL_COLOR = "#030064";
export const STROKE_COLORS = [
  "#1e1e1e",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
];

export const BACKGROUND_COLORS = ["#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];

export const CANVAS_BG_COLORS = [
  "#ffffff",
  "#f8f9fa",
  "#f5faff",
  "#fffce8",
  "#fdf8f6",
];

export enum MenuOption {
  Open = "open",
  Save = "save",
  Export = "export",
  Reset = "reset",
}

export const MENU_OPTIONS = [
  {
    id: MenuOption.Open,
    label: "Open",
    icon: <Open />,
    keyBind: "Ctrl+O",
  },
  {
    id: MenuOption.Save,
    label: "Save",
    icon: <Save />,
  },
  {
    id: MenuOption.Export,
    label: "Export Image",
    icon: <ExportImage />,
    keyBind: "Ctrl+Shift+E",
  },
  {
    id: MenuOption.Reset,
    label: "Reset Canvas",
    icon: <Trash />,
  },
];

export enum SecondaryAction {
  Undo = "undo",
  Redo = "redo",
  ZoomIn = "zoomIn",
  ZoomOut = "zoomOut",
  ResetZoom = "resetZoom",
}
