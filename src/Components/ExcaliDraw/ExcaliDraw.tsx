import { Box, Flex } from "@chakra-ui/react";
import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import React, { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
} from "react-konva";
import { DrawAction } from "../../constants";
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

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isPaintRef = useRef(false);
    const stageRef = useRef<any>();

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
      const x = getNumericVal(pos?.x);
      const y = getNumericVal(pos?.y);

      isPaintRef.current = true;

      const id = uuidv4();

      const commonProps = {
        id,
        key: id,
        scaleX: 1,
        scaleY: 1,
      };

      switch (drawAction) {
        case DrawAction.Scribble:
        case DrawAction.Line:
          updateCurrentDrawnShape<LineConfig>(() => ({
            ...commonProps,
            lineCap: "round",
            lineJoin: "round",
            points: [x, y, x, y],
            stroke: color,
            name: DrawAction.Line,
          }));

          break;
        case DrawAction.Circle: {
          updateCurrentDrawnShape<CircleConfig>(() => ({
            ...commonProps,
            radius: 1,
            x,
            y,
            stroke: color,
            name: DrawAction.Circle,
          }));
          break;
        }

        case DrawAction.Rectangle:
        case DrawAction.Diamond: {
          updateCurrentDrawnShape<RectConfig>(() => ({
            ...commonProps,
            height: 1,
            width: 1,
            x,
            y,
            stroke: color,
            rotationDeg: drawAction === DrawAction.Diamond ? 45 : 0,
            name: DrawAction.Rectangle,
          }));
          break;
        }
        case DrawAction.Arrow: {
          updateCurrentDrawnShape<ArrowConfig>(() => ({
            ...commonProps,
            points: [x, y, x, y],
            fill: color,
            stroke: color,
            name: DrawAction.Arrow,
          }));
          break;
        }
      }
    };

    const onStageMouseMove = () => {
      if (!isPaintRef.current) return;

      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x);
      const y = getNumericVal(pos?.y);

      switch (drawAction) {
        case DrawAction.Scribble: {
          updateCurrentDrawnShape<LineConfig>((prevScribble) => ({
            points: [...(prevScribble.points || []), x, y],
          }));

          break;
        }
        case DrawAction.Line: {
          updateCurrentDrawnShape<LineConfig>((prevLine) => ({
            points: [
              prevLine?.points?.[0] || 0,
              prevLine?.points?.[1] || 0,
              x,
              y,
            ],
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
          updateCurrentDrawnShape<RectConfig>((prevRectangle) => {
            const height = y - (prevRectangle.y || 0);
            const width = x - (prevRectangle.x || 0);
            const maxMeasure = Math.max(height, width);
            return {
              height: maxMeasure,
              width: maxMeasure,
            };
          });
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

    const backgroundRef = useRef<any>(null);

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

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
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
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
                return <KonvaRect {...drawing} />;
              }
              if (drawing?.name === DrawAction.Circle) {
                return <KonvaCircle {...drawing} />;
              }
              if (drawing?.name === DrawAction.Line) {
                return <KonvaLine {...drawing} />;
              }
              if (drawing?.name === DrawAction.Arrow) {
                return <KonvaArrow {...(drawing as ArrowConfig)} />;
              }
              return null;
            })}
          </Layer>
        </Stage>
      </Box>
    );
  }
);
