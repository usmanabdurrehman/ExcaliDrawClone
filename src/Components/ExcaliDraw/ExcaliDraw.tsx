import { Box, Flex } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Image as KonvaImage,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import {
  CanvasAction,
  DrawAction,
  LayerOptions,
  MiscActions,
  SCALE_BY,
  SecondaryAction,
} from "../../constants";
import { getNumericVal } from "../../utilities";
import { ActionButtons } from "../ActionButtons";
import { Menu } from "../Menu";
import { Options } from "../Options";
import { SecondaryActionButtons } from "../SecondaryActionButtons";
import { v4 as uuidv4 } from "uuid";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { LineConfig } from "konva/lib/shapes/Line";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { RectConfig } from "konva/lib/shapes/Rect";
import Konva from "konva";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentShapeRef = useRef<string>();
    const isPaintRef = useRef(false);
    const isSelectionRef = useRef(false);
    const stageRef = useRef<any>();

    const [{ x: stageX, y: stageY }, setStageXY] = useState({ x: 0, y: 0 });

    const [drawings, setDrawings] = useState<NodeConfig[]>([]);
    const [currentlyDrawnShape, setCurrentlyDrawnShape] =
      useState<NodeConfig>();

    const [drawAction, setDrawAction] = useState<DrawAction>(
      DrawAction.Rectangle
    );
    const color = "#000";

    const onStageMouseUp = () => {
      isPaintRef.current = false;

      if (currentlyDrawnShape) {
        setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
      }
      setCurrentlyDrawnShape(undefined);
    };

    const updateCurrentDrawnShape = <T,>(updaterFn: (payload: T) => T) => {
      setCurrentlyDrawnShape((prevDrawnShape) => {
        return {
          ...(prevDrawnShape || {}),
          ...updaterFn(prevDrawnShape as T),
        };
      });
    };

    const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;

      isPaintRef.current = true;

      const id = uuidv4();
      currentShapeRef.current = id;

      switch (drawAction) {
        case DrawAction.Text: {
          break;
        }
        case DrawAction.Scribble:
          updateCurrentDrawnShape<LineConfig>(() => ({
            id,
            points: [x, y, x, y],
            color,
            scaleX: 1,
            scaleY: 1,
            stroke: color,
            name: DrawAction.Scribble,
          }));

          break;
        case DrawAction.Circle: {
          updateCurrentDrawnShape<CircleConfig>(() => ({
            id,
            radius: 1,
            x,
            y,
            color,
            scaleX: 1,
            scaleY: 1,
            stroke: color,
            name: DrawAction.Circle,
          }));
          break;
        }

        case DrawAction.Rectangle:
        case DrawAction.Diamond: {
          updateCurrentDrawnShape<RectConfig>(() => ({
            height: 1,
            width: 1,
            x,
            y,
            color,
            scaleX: 1,
            scaleY: 1,
            stroke: color,
            id,
            rotationDeg: drawAction === DrawAction.Diamond ? 45 : 0,
            name: DrawAction.Rectangle,
          }));
          break;
        }
        case DrawAction.Arrow: {
          updateCurrentDrawnShape<ArrowConfig>(() => ({
            id,
            points: [x, y, x, y],
            fill: color,
            stroke: color,
            scaleX: 1,
            scaleY: 1,
            name: DrawAction.Arrow,
          }));
          break;
        }
      }
    };

    const onStageMouseMove = () => {
      if (
        (drawAction === DrawAction.Select && !isSelectionRef.current) ||
        !isPaintRef.current
      )
        return;

      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;

      switch (drawAction) {
        case DrawAction.Scribble: {
          updateCurrentDrawnShape<LineConfig>((prevScribble) => ({
            points: [...(prevScribble.points || []), x, y],
          }));

          break;
        }
        case DrawAction.Circle: {
          updateCurrentDrawnShape<CircleConfig>((prevCircle) => ({
            radius:
              ((x - (prevCircle.x || 0)) ** 2 +
                (y - (prevCircle.y || 0)) ** 2) **
              0.5,
          }));

          break;
        }
        case DrawAction.Rectangle: {
          updateCurrentDrawnShape<RectConfig>((prevRectangle) => ({
            height: y - (prevRectangle.y || 0),
            width: x - (prevRectangle.x || 0),
          }));
          break;
        }
        case DrawAction.Diamond: {
          break;
        }
        case DrawAction.Arrow: {
          updateCurrentDrawnShape<ArrowConfig>((prevArrow) => ({
            points: [prevArrow?.points[0], prevArrow?.points[1], x, y],
          }));

          break;
        }
      }
    };

    const isStageDraggable = drawAction === DrawAction.Move;

    let mouseCursor;
    switch (drawAction) {
      case DrawAction.Move: {
        mouseCursor = "grab";
        break;
      }
      case DrawAction.ZoomIn: {
        mouseCursor = "zoom-in";
        break;
      }
      case DrawAction.ZoomOut: {
        mouseCursor = "zoom-out";
        break;
      }
    }

    const backgroundRef = useRef<any>(null);

    const getShapeProps = (shape: NodeConfig) => ({
      key: shape.id,
      id: shape.id,
      scaleX: shape.scaleX,
      scaleY: shape.scaleY,
    });

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    const image = new Image(300, 300);
    image.src = "./transparentFill.png";

    return (
      <Box ref={containerRef} pos="relative" height="100vh" width="100vw">
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          pos="absolute"
          top="20px"
          width="100%"
          zIndex={1}
          pl={4}
        >
          <Menu />
          <ActionButtons action={drawAction} onChange={setDrawAction} />
          <Box />
        </Flex>

        <Box
          zIndex={1}
          left={4}
          pos="absolute"
          top="90px"
          height="65vh"
          overflow="auto"
        >
          <Options type={DrawAction.Arrow} />
        </Box>

        <Box zIndex={1} left={4} pos="absolute" bottom="20px">
          <SecondaryActionButtons />
        </Box>

        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          draggable={isStageDraggable}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          x={stageX}
          y={stageY}
        >
          <Layer>
            <KonvaRect
              ref={backgroundRef}
              x={0}
              y={0}
              fill={"white"}
              id="bg"
              listening={false}
            />

            {[...drawings, currentlyDrawnShape].map((drawing) => {
              if (drawing?.name === DrawAction.Rectangle) {
                return <KonvaRect {...drawing} {...getShapeProps(drawing)} />;
              }
              if (drawing?.name === DrawAction.Circle) {
                return <KonvaCircle {...drawing} {...getShapeProps(drawing)} />;
              }
              if (drawing?.name === DrawAction.Scribble) {
                return (
                  <KonvaLine
                    lineCap="round"
                    lineJoin="round"
                    {...drawing}
                    {...getShapeProps(drawing)}
                  />
                );
              }
              if (drawing?.name === DrawAction.Arrow) {
                return (
                  <KonvaArrow
                    {...(drawing as ArrowConfig)}
                    {...getShapeProps(drawing)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </Box>
    );
  }
);
