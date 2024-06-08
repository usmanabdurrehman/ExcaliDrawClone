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
import { Text } from "../../types";
import { downloadURI, getNumericVal, reorderArray } from "../../utilities";
import { ActionButtons } from "../ActionButtons";
import { Menu } from "../Menu";
import { Options } from "../Options";
import { SecondaryActionButtons } from "../SecondaryActionButtons";
import { v4 as uuidv4 } from "uuid";
import { useKeyBindings, useStoreProgress } from "../../hooks";
import { ArrowConfig } from "konva/lib/shapes/Arrow";
import { LineConfig } from "konva/lib/shapes/Line";
import { CircleConfig } from "konva/lib/shapes/Circle";
import { RectConfig } from "konva/lib/shapes/Rect";
import { transform } from "framer-motion";
import Konva from "konva";

interface ExcaliDrawProps {}

export const ExcaliDraw: React.FC<ExcaliDrawProps> = React.memo(
  function ExcaliDraw({}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentShapeRef = useRef<string>();
    const isPaintRef = useRef(false);
    const isSelectionRef = useRef(false);
    const stageRef = useRef<any>();

    const transformerRef = useRef<any>(null);

    const [{ x: stageX, y: stageY }, setStageXY] = useState({ x: 0, y: 0 });

    const [texts, setTexts] = useState<Text[]>([]);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [drawings, setDrawings] = useState<NodeConfig[]>([]);
    const [currentlyDrawnShape, setCurrentlyDrawnShape] =
      useState<NodeConfig>();
    const [selectionBox, setSelectionBox] = useState<NodeConfig>();

    const [textPosition, setTextPosition] = useState<{
      x: number;
      y: number;
    }>();
    const [editText, setEditText] = useState("");

    const [canvasHistory, setCanvasHistory] = useState<
      {
        type: CanvasAction;
        drawAction: DrawAction | undefined;
        payload: any;
      }[]
    >([]);

    const [drawAction, setDrawAction] = useState<DrawAction>(
      DrawAction.Scribble
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const color = "#000";

    const onBlurTextField = useCallback(() => {
      setTextPosition(undefined);
      const id = currentShapeRef?.current;
      if (!id || !textPosition) return;
      setTexts((prevTexts) => [
        ...prevTexts,
        {
          id,
          x: textPosition?.x,
          y: textPosition?.y,
          text: editText,
          color: color,
          scaleX: 1,
          scaleY: 1,
        },
      ]);
      setEditText("");
    }, [editText, color, textPosition]);

    const [currentSelectedShape, setCurrentSelectedShape] = useState<{
      type: DrawAction;
      id: string;
      node: Node<NodeConfig>;
      props?: NodeConfig;
    }>();

    const deSelect = useCallback(() => {
      transformerRef?.current?.nodes([]);
      setCurrentSelectedShape(undefined);
    }, []);

    const checkDeselect = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        // This stopped working for some reason
        // const clickedOnEmpty = e.target === stageRef?.current?.find("#bg")?.[0];
        const clickedOnEmpty = e.target === stageRef?.current;
        if (clickedOnEmpty) {
          deSelect();
        }
      },
      [stageRef, deSelect]
    );

    const onStageMouseUp = () => {
      isPaintRef.current = false;
      console.log({ isSelectionRef });
      if (isSelectionRef.current) {
        const shapes = stageRef?.current?.find((node: any) => {
          console.log({ node });
          return node?.attrs?.name !== DrawAction.Select;
        });
        const selectionBox = stageRef?.current?.find(`.${DrawAction.Select}`);
        console.log({ selectionBox });
        const box = selectionBox?.[0]?.getClientRect();
        const selected = shapes.filter((shape: any) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        transformerRef?.current?.nodes(selected);
        isSelectionRef.current = false;
        setSelectionBox(undefined);
      }
      if (currentlyDrawnShape)
        setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
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
      checkDeselect(e);
      const stage = stageRef?.current;
      const pos = stage?.getPointerPosition();
      const x = getNumericVal(pos?.x) - stageX;
      const y = getNumericVal(pos?.y) - stageY;
      console.log({ transformerRef });
      if (
        drawAction === DrawAction.Select &&
        !transformerRef?.current?.nodes()?.length
      ) {
        isSelectionRef.current = true;
        setSelectionBox({
          height: 1,
          width: 1,
          x,
          y,
          color,
          scaleX: 1,
          scaleY: 1,
          fill: "rgba(0,0,255,0.5)",
          opacity: 0.2,
          listening: false,
          name: DrawAction.Select,
        });
      }

      isPaintRef.current = true;

      const id = uuidv4();
      currentShapeRef.current = id;

      const shouldUpdateCanvasHistory = [
        DrawAction.Arrow,
        DrawAction.Circle,
        DrawAction.Rectangle,
        DrawAction.Scribble,
        DrawAction.Text,
      ].includes(drawAction);

      shouldUpdateCanvasHistory &&
        setCanvasHistory((prevCanvasHistory) => [
          ...prevCanvasHistory,
          { type: CanvasAction.Add, drawAction, payload: { id } },
        ]);

      switch (drawAction) {
        case DrawAction.Text: {
          onBlurTextField();
          setTextPosition({ x, y });
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
      if (drawAction === DrawAction.Select) {
        setSelectionBox((prevSelectionBox) => ({
          ...prevSelectionBox,
          height: y - (prevSelectionBox?.y || 0),
          width: x - (prevSelectionBox?.x || 0),
        }));
      }

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

    const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
      if (drawAction !== DrawAction.Select) return;
      const currentTarget = e.currentTarget;

      const type = currentTarget?.attrs?.name;
      const id = currentTarget?.attrs?.id;

      setCurrentSelectedShape({
        type,
        id,
        node: currentTarget,
        props: drawings?.find((record) => record.id === id),
      });
      transformerRef?.current?.node(currentTarget);
    };

    const isDraggable = drawAction === DrawAction.Select;
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

    const onTransformShapeStart = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        setCanvasHistory((prevCanvasHistory) => [
          ...prevCanvasHistory,
          {
            type: CanvasAction.Resize,
            drawAction: e.target.attrs.name,
            payload: {
              id: e.target.attrs.id,
              scaleX: e.target.attrs.scaleX,
              scaleY: e.target.attrs.scaleY,
            },
          },
        ]);
      },
      []
    );

    const onDragShapeStart = useCallback((e: KonvaEventObject<MouseEvent>) => {
      setCanvasHistory((prevCanvasHistory) => [
        ...prevCanvasHistory,
        {
          type: CanvasAction.Drag,
          drawAction: e.target.attrs.name,
          payload: {
            id: e.target.attrs.id,
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          },
        },
      ]);
    }, []);

    const onUndoClick = useCallback(() => {
      const canvasHistoryPayload = [...canvasHistory];
      const lastAction = canvasHistoryPayload.pop();
      setCanvasHistory(canvasHistoryPayload);

      const id = lastAction?.payload?.id;
      switch (lastAction?.type) {
        case CanvasAction.Add: {
          transformerRef?.current?.nodes([]);
          setDrawings((prevRecords) =>
            prevRecords.filter((prevRecord) => prevRecord.id !== id)
          );
          break;
        }
        case CanvasAction.Delete: {
          setDrawings((prevRecords) => [
            ...prevRecords,
            lastAction?.payload?.record,
          ]);
          break;
        }
        case CanvasAction.Resize: {
          setDrawings((prevRecords) =>
            prevRecords.map((prevRecord) =>
              prevRecord.id === id
                ? { ...prevRecord, ...lastAction?.payload }
                : prevRecord
            )
          );
          break;
        }
        case CanvasAction.Drag: {
          setDrawings((prevRecords) =>
            prevRecords.map((prevRecord) =>
              prevRecord.id === id
                ? { ...prevRecord, ...lastAction?.payload }
                : prevRecord
            )
          );
          break;
        }
      }
    }, [canvasHistory]);

    const onDeleteShape = useCallback(() => {
      const record = drawings?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      setCanvasHistory((prevCanvasHistory) => {
        return [
          ...prevCanvasHistory,
          {
            type: CanvasAction.Delete,
            drawAction: currentSelectedShape?.type,
            payload: { id: currentSelectedShape?.id, record },
          },
        ];
      });

      transformerRef?.current?.nodes([]);
      setDrawings((prevRecords) =>
        prevRecords.filter((record) => record.id !== currentSelectedShape?.id)
      );
      setCurrentSelectedShape(undefined);
    }, [currentSelectedShape]);

    const onClear = useCallback(() => {
      setDrawings([]);
      setImages([]);
      setTexts([]);
    }, []);

    const onStageClick = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        if (
          ![DrawAction.ZoomIn, DrawAction.ZoomOut].includes(
            drawAction as DrawAction
          )
        )
          return;

        e.evt.preventDefault();
        const stage = stageRef?.current;

        const oldScale = getNumericVal(stage?.scaleX());
        const pointer = stage?.getPointerPosition() || { x: 0, y: 0 };

        const mousePointTo = {
          x: (pointer?.x - getNumericVal(stage?.x())) / oldScale,
          y: (pointer?.y - getNumericVal(stage?.y())) / oldScale,
        };

        const direction = drawAction === DrawAction.ZoomIn ? 1 : -1;

        const newScale =
          direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

        stage?.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };

        stage?.position(newPos);
      },
      [drawAction, stageRef]
    );

    const onDragShapeEnd = useCallback((e: KonvaEventObject<MouseEvent>) => {
      const type = e.target?.attrs?.name;
      const id = e.target?.attrs?.id;

      setDrawings((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id
            ? { ...record, x: e.target.x(), y: e.target.y() }
            : record
        )
      );
    }, []);

    const onTransformShapeEnd = useCallback(
      (e: KonvaEventObject<MouseEvent>) => {
        const type = e.target?.attrs?.name;
        const id = e.target?.attrs?.id;

        setDrawings((prevRecords) =>
          prevRecords.map((record) =>
            record.id === id
              ? {
                  ...record,
                  scaleX: e.target.attrs.scaleX,
                  scaleY: e.target.attrs.scaleY,
                }
              : record
          )
        );
      },
      []
    );

    const onImportImageSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
          const imageURL = URL.createObjectURL(e.target.files[0]);
          const image = new Image(300 / 2, 300 / 2);
          image.src = imageURL;
          setImages((prevImages) => [...prevImages, image]);
        }
        e.target.files = null;
      },
      []
    );

    const fileRef = useRef<HTMLInputElement>(null);
    const onImportImageClick = useCallback(() => {
      fileRef?.current && fileRef?.current?.click();
    }, []);
    const onExportClick = useCallback(() => {
      const dataURL = stageRef?.current?.toDataURL({ pixelRatio: 3 });
      downloadURI(dataURL, "image.png");
    }, []);

    const onClearOptionClick = useCallback(
      (action: DrawAction) => {
        switch (action) {
          case DrawAction.Clear: {
            onClear();
            break;
          }
          case DrawAction.Delete: {
            onDeleteShape();
            break;
          }
          case DrawAction.Undo: {
            onUndoClick();
            break;
          }
        }
      },
      [onClear, onDeleteShape, onUndoClick]
    );

    const onAction = useCallback(
      (action: DrawAction) => {
        switch (action) {
          case DrawAction.Rectangle:
          case DrawAction.Circle:
          case DrawAction.Scribble:
          case DrawAction.Arrow:
          case DrawAction.Select: {
            setDrawAction(action);
            break;
          }
          default: {
            onClearOptionClick(action);
          }
        }
      },
      [onClearOptionClick]
    );

    useKeyBindings({ onAction, isWritingInProgress: !!textPosition });
    const backgroundRef = useRef<any>(null);

    useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
    }, [inputRef]);

    // const { downloadDrawingState } = useStoreProgress({
    //   setTexts,
    //   setArrows,
    //   setRectangles,
    //   setCircles,
    //   setScribbles,
    //   scribbles,
    //   arrows,
    //   texts,
    //   rectangles,
    //   circles,
    // });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }, [isSaving]);

    // const onDownloadProjectClick = useCallback(() => {
    //   setIsSaving(true);
    //   downloadDrawingState();
    // }, [downloadDrawingState]);

    const getShapeProps = useCallback(
      (shape: NodeConfig) => ({
        key: shape.id,
        id: shape.id,
        onDragStart: onDragShapeStart,
        onDragEnd: onDragShapeEnd,
        onTransformStart: onTransformShapeStart,
        onTransformEnd: onTransformShapeEnd,
        onClick: onShapeClick,
        scaleX: shape.scaleX,
        scaleY: shape.scaleY,
        draggable: isDraggable,
      }),
      [
        onDragShapeStart,
        onDragShapeEnd,
        onTransformShapeStart,
        onTransformShapeEnd,
        onShapeClick,
        isDraggable,
      ]
    );

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    const onSecondaryActionChange = useCallback((action: SecondaryAction) => {},
    []);

    const onDuplicate = () => {
      const record = drawings?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      if (!record) return;
      setDrawings((prevRecords) => [
        ...prevRecords,
        {
          ...record,
          id: uuidv4(),
          x: (record.x || 0) + 5,
          y: (record.y || 0) + 5,
        },
      ]);
      // TODO: update currentSelectedShape to duplicated shape
    };

    console.log({ selectionBox });

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
          <ActionButtons
            onActionChange={setDrawAction}
            selectedAction={drawAction}
          />
          <Box />
        </Flex>
        {currentSelectedShape && (
          <Box
            zIndex={1}
            left={4}
            pos="absolute"
            top="90px"
            height="65vh"
            overflow="auto"
          >
            <Options
              type={currentSelectedShape.type}
              onAction={(action) => {
                switch (action) {
                  case MiscActions.Delete: {
                    onDeleteShape();
                    break;
                  }
                  case MiscActions.Duplicate: {
                    onDuplicate();
                    break;
                  }
                  case MiscActions.Link: {
                    break;
                  }
                }
              }}
              nodeAttrs={currentSelectedShape.props}
              onShapeAction={(payload) => {
                setCurrentSelectedShape((prevSelectedShape) => ({
                  ...currentSelectedShape,
                  props: { ...(currentSelectedShape || {})?.props, ...payload },
                }));

                setDrawings((prevRecords) =>
                  prevRecords.map((record) =>
                    record.id === currentSelectedShape?.id
                      ? { ...record, ...payload }
                      : record
                  )
                );
              }}
              onLayerChange={(action) => {
                const drawingIndex = drawings?.findIndex(
                  (drawing) => drawing.id === currentSelectedShape?.id
                );
                switch (action) {
                  case LayerOptions.SendToBack: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, 0)
                    );
                    break;
                  }
                  case LayerOptions.SendBackward: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawingIndex - 1)
                    );
                    break;
                  }
                  case LayerOptions.SendForward: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawingIndex + 1)
                    );
                    break;
                  }
                  case LayerOptions.SendToFront: {
                    setDrawings((drawings) =>
                      reorderArray(drawings, drawingIndex, drawings?.length - 1)
                    );
                    break;
                  }
                }
              }}
            />
          </Box>
        )}
        <Box zIndex={1} left={4} pos="absolute" bottom="20px">
          <SecondaryActionButtons onActionChange={onSecondaryActionChange} />
        </Box>

        <Stage
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          draggable={isStageDraggable}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onClick={onStageClick}
          x={stageX}
          y={stageY}
          onDragEnd={(e: KonvaEventObject<MouseEvent>) => {
            // setStageXY({ x: e.target.x(), y: e.target.y() });
          }}
          onDragMove={() => {
            backgroundRef?.current?.absolutePosition({ x: 0, y: 0 });
          }}
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
            {images.map((image, index) => (
              <KonvaImage
                key={index}
                image={image}
                x={0}
                y={0}
                onClick={onShapeClick}
                draggable={isDraggable}
                name="image"
              />
            ))}
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

            {texts.map((text) => (
              <KonvaText
                name={DrawAction.Text}
                text={text.text}
                x={text.x}
                y={text.y}
                stroke={text.color}
                letterSpacing={1.7}
                fontSize={14}
                {...getShapeProps(text)}
              />
            ))}
            <Transformer
              ref={transformerRef}
              borderDash={[3, 1]}
              anchorStroke="#6965db"
              borderStroke="#6965db"
              anchorCornerRadius={2}
              anchorSize={8}
              rotateLineVisible={false}
              rotateAnchorOffset={20}
            />
            {selectionBox && <KonvaRect {...selectionBox} />}
          </Layer>
        </Stage>
      </Box>
    );
  }
);
