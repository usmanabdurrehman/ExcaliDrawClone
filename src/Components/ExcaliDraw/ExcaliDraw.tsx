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
  MenuOption,
  MiscActions,
  SCALE_BY,
  SecondaryAction,
} from "../../constants";
import {
  downloadURI,
  getNumericVal,
  getRelativePointerPosition,
  reorderArray,
  resizeBase64Img,
  round,
} from "../../utilities";
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
import Konva from "konva";
import { ImageConfig } from "konva/lib/shapes/Image";

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

    const [texts, setTexts] = useState<any[]>([]);
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
    const historyIndexRef = useRef(-1);

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

    const updateCanvasHistory = ({
      type,
      drawAction,
      payload,
      isUpdate,
    }: {
      type: CanvasAction;
      drawAction: DrawAction;
      payload: any;
      isUpdate?: boolean;
    }) => {
      if (isUpdate) {
        setCanvasHistory((prevCanvasHistory) => {
          const canvasHistory = [...prevCanvasHistory];
          const lastItem = canvasHistory?.at(-1);
          if (lastItem)
            canvasHistory[canvasHistory.length - 1] = {
              ...lastItem,
              payload: { ...lastItem?.payload, ...payload },
            } as any;
          return canvasHistory;
        });
        return;
      }
      setCanvasHistory((prevCanvasHistory) => [
        ...prevCanvasHistory,
        { type, drawAction, payload },
      ]);
      historyIndexRef.current += 1;
    };

    const onStageMouseUp = () => {
      isPaintRef.current = false;
      if (isSelectionRef.current) {
        const shapes = stageRef?.current?.find((node: any) => {
          return node?.attrs?.name !== DrawAction.Select;
        });
        const selectionBox = stageRef?.current?.find(`.${DrawAction.Select}`);

        const box = selectionBox?.[0]?.getClientRect();
        const selected = shapes.filter((shape: any) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        transformerRef?.current?.nodes(selected);
        isSelectionRef.current = false;
        setSelectionBox(undefined);
      }
      if (currentlyDrawnShape) {
        setDrawings((prevDrawings) => [...prevDrawings, currentlyDrawnShape]);
        const shouldUpdateCanvasHistory = [
          DrawAction.Arrow,
          DrawAction.Circle,
          DrawAction.Rectangle,
          DrawAction.Scribble,
          DrawAction.Text,
        ].includes(drawAction);

        if (shouldUpdateCanvasHistory) {
          updateCanvasHistory({
            type: CanvasAction.Add,
            drawAction,
            payload: currentlyDrawnShape,
          });
        }

        setCurrentlyDrawnShape(undefined);
      }
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
      if (e.evt.button !== 0) return;
      const stage = stageRef?.current;

      const pos = getRelativePointerPosition(stage);
      const x = getNumericVal(pos?.x);
      const y = getNumericVal(pos?.y);
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

      const pos = getRelativePointerPosition(stage);
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

    const onTransformShapeStart = (e: KonvaEventObject<MouseEvent>) => {
      updateCanvasHistory({
        type: CanvasAction.Resize,
        drawAction: e.target.attrs.name,
        payload: {
          id: e.target.attrs.id,
          oldParams: {
            scaleX: e.target.attrs.scaleX,
            scaleY: e.target.attrs.scaleY,
          },
        },
      });
    };

    const onDragShapeStart = (e: KonvaEventObject<MouseEvent>) => {
      updateCanvasHistory({
        type: CanvasAction.Drag,
        drawAction: e.target.attrs.name,
        payload: {
          id: e.target.attrs.id,
          oldParams: {
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          },
        },
      });
    };

    const onDragShapeEnd = (e: KonvaEventObject<MouseEvent>) => {
      const id = e.target?.attrs?.id;

      updateCanvasHistory({
        type: CanvasAction.Drag,
        drawAction: e.target.attrs.name,
        payload: {
          newParams: {
            id: e.target.attrs.id,
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          },
        },
        isUpdate: true,
      });

      setDrawings((prevRecords) =>
        prevRecords.map((record) =>
          record.id === id
            ? { ...record, x: e.target.x(), y: e.target.y() }
            : record
        )
      );
    };

    const onTransformShapeEnd = (e: KonvaEventObject<MouseEvent>) => {
      const id = e.target?.attrs?.id;

      updateCanvasHistory({
        type: CanvasAction.Resize,
        drawAction: e.target.attrs.name,
        payload: {
          newParams: {
            id: e.target.attrs.id,
            scaleX: e.target.attrs.scaleX,
            scaleY: e.target.attrs.scaleY,
          },
        },
        isUpdate: true,
      });

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
    };

    const onHistory = (isUndo = false) => {
      let lastAction =
        canvasHistory[
          isUndo ? historyIndexRef.current-- : ++historyIndexRef.current
        ];

      const id = lastAction?.payload?.id;
      switch (lastAction?.type) {
        case CanvasAction.Add: {
          transformerRef?.current?.nodes([]);
          if (isUndo)
            setDrawings((prevRecords) =>
              prevRecords.filter((prevRecord) => prevRecord.id !== id)
            );
          else
            setDrawings((prevRecords) => [...prevRecords, lastAction?.payload]);
          break;
        }
        case CanvasAction.Delete: {
          if (isUndo)
            setDrawings((prevRecords) => [...prevRecords, lastAction?.payload]);
          else
            setDrawings((prevRecords) =>
              prevRecords.filter((prevRecord) => prevRecord.id !== id)
            );
          break;
        }
        case CanvasAction.Resize: {
          setDrawings((prevRecords) =>
            prevRecords.map((prevRecord) => {
              if (prevRecord.id === id) {
                const newObj = {
                  ...prevRecord,
                  ...(isUndo
                    ? lastAction?.payload?.oldParams
                    : lastAction?.payload?.newParams),
                };
                return newObj;
              }
              return prevRecord;
            })
          );
          break;
        }
        case CanvasAction.Drag: {
          setDrawings((prevRecords) =>
            prevRecords.map((prevRecord) =>
              prevRecord.id === id
                ? {
                    ...prevRecord,
                    ...(isUndo
                      ? lastAction?.payload?.oldParams
                      : lastAction?.payload?.newParams),
                  }
                : prevRecord
            )
          );
          break;
        }
      }
    };

    const onDeleteShape = useCallback(() => {
      const record = drawings?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      updateCanvasHistory({
        type: CanvasAction.Delete,
        drawAction: currentSelectedShape?.type as DrawAction,
        payload: record,
      });

      transformerRef?.current?.nodes([]);
      setDrawings((prevRecords) =>
        prevRecords.filter((record) => record.id !== currentSelectedShape?.id)
      );
      setCurrentSelectedShape(undefined);
    }, [currentSelectedShape]);

    const [zoom, setZoom] = useState(1);

    const onZoom = useCallback(
      (action: SecondaryAction) => {
        const stage = stageRef?.current;

        const oldScale = getNumericVal(stage?.scaleX());
        const pointer = {
          x: stage?.attrs?.width / 2,
          y: stage?.attrs?.height / 2,
        };

        const mousePointTo = {
          x: (pointer?.x - getNumericVal(stage?.x())) / oldScale,
          y: (pointer?.y - getNumericVal(stage?.y())) / oldScale,
        };

        const direction = action === SecondaryAction.ZoomIn ? 1 : -1;

        let newScale = round(
          direction > 0 ? oldScale + SCALE_BY : oldScale - SCALE_BY,
          1
        );
        if (action === SecondaryAction.ResetZoom) newScale = 1;
        setZoom(newScale);
        console.log({ newScale });

        stage?.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };

        stage?.position(newPos);
      },
      [drawAction, stageRef]
    );

    const onAction = useCallback((action: DrawAction) => {
      switch (action) {
        case DrawAction.Rectangle:
        case DrawAction.Circle:
        case DrawAction.Scribble:
        case DrawAction.Arrow:
        case DrawAction.Select: {
          setDrawAction(action);
          break;
        }
      }
    }, []);

    useKeyBindings({ onAction, isWritingInProgress: !!textPosition });
    const backgroundRef = useRef<any>(null);

    useEffect(() => {
      if (inputRef.current) inputRef.current.focus();
    }, [inputRef]);

    const getShapeProps = (shape: NodeConfig) => ({
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
    });

    useEffect(() => {
      if (containerRef.current) {
        stageRef?.current?.width(containerRef.current.offsetWidth);
        stageRef?.current?.height(containerRef.current.offsetHeight);
      }
    }, [containerRef]);

    const onSecondaryActionChange = (action: SecondaryAction) => {
      switch (action) {
        case SecondaryAction.Undo: {
          onHistory(true);
          break;
        }
        case SecondaryAction.Redo: {
          onHistory();
          break;
        }
        default: {
          onZoom(action);
        }
      }
    };

    const onDuplicate = () => {
      const record = drawings?.find(
        (record) => record.id === currentSelectedShape?.id
      );
      if (!record) return;
      const id = uuidv4();
      const newRecord = {
        ...record,
        id,
        x: (record.x || 0) + 5,
        y: (record.y || 0) + 5,
      };
      setDrawings((prevRecords) => [...prevRecords, newRecord]);
    };

    useEffect(() => {
      const newRecord = drawings?.at(-1);
      const type = newRecord?.name as DrawAction;
      const node = stageRef?.current?.findOne((node: any) => {
        return node.attrs.id === newRecord?.id;
      });

      setCurrentSelectedShape({
        type,
        id: newRecord?.id || "",
        node,
        props: newRecord,
      });
      transformerRef?.current?.node(node);
    }, [drawings]);

    const { downloadDrawingState, resetCanvas, loadCanvas } = useStoreProgress({
      drawings,
      setDrawings,
    });

    const projectFileRef = useRef<HTMLInputElement>(null);

    const onMenuAction = (action: MenuOption) => {
      switch (action) {
        case MenuOption.Open: {
          if (projectFileRef) projectFileRef.current?.click();
          break;
        }
        case MenuOption.Export: {
          const dataURL = stageRef?.current?.toDataURL({ pixelRatio: 3 });
          downloadURI(dataURL, "image.png");
          break;
        }
        case MenuOption.Reset: {
          resetCanvas();
          break;
        }
        case MenuOption.Save: {
          downloadDrawingState();
          break;
        }
      }
    };

    // console.log({ drawings });
    const imageRef = useRef<HTMLInputElement>(null);

    const [imageInfo, setImageInfo] = useState<{
      image: string;
      height: number;
      width: number;
    }>();
    const [resizedImage, setResizedImage] = useState<string>();

    let cursor: string | undefined;
    if (resizedImage) {
      cursor = `url(${resizedImage}), auto`;
    }

    const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
      const stage = stageRef?.current;

      const pos = getRelativePointerPosition(stage);
      const x = getNumericVal(pos?.x);
      const y = getNumericVal(pos?.y);

      const image = new Image();
      image.src = imageInfo?.image || "";

      setDrawings((prevDrawings) => [
        ...prevDrawings,
        {
          image: image,
          x,
          y,
          name: DrawAction.Image,
          height: imageInfo?.height,
          width: imageInfo?.width,
        } as ImageConfig,
      ]);
      setResizedImage(undefined);
      setImageInfo(undefined);
    };

    // useEffect(() => {
    //   const request = window.indexedDB.open("excalidraw", 1);
    //   request.onupgradeneeded = (event) => {
    //     const db = event.target?.result;
    //     const imgStore = db
    //       .transaction("images", "readwrite")
    //       .objectStore("images");
    //     imgStore?.add("lol");
    //   };
    // }, []);

    return (
      <Box
        ref={containerRef}
        pos="relative"
        height="100vh"
        width="100vw"
        cursor={cursor}
      >
        <input
          style={{ display: "none" }}
          type="file"
          ref={projectFileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fileReader = new FileReader();
            fileReader.onload = () => {
              loadCanvas(fileReader.result as string);
            };
            fileReader.readAsText(file);
          }}
          accept="application/json"
        />
        <input
          style={{ display: "none" }}
          type="file"
          ref={imageRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const fileReader = new FileReader();
            fileReader.onload = () => {
              const base64 = fileReader.result as string;
              resizeBase64Img({ base64, height: 60, width: 60 }).then(
                (result) => {
                  setResizedImage(result as string);
                }
              );

              const image = new Image();

              image.onload = function (e) {
                const { height, width } = this as HTMLImageElement;
                setImageInfo({
                  height,
                  width,
                  image: base64,
                });
              };
              image.src = base64;
            };
            fileReader.readAsDataURL(file);
          }}
          accept="image/*"
        />
        <Flex
          alignItems={"center"}
          justifyContent="space-between"
          pos="absolute"
          top="20px"
          width="100%"
          zIndex={1}
          pl={4}
        >
          <Menu onAction={onMenuAction} />
          <ActionButtons
            onChange={(action) => {
              setDrawAction(action);
              switch (action) {
                case DrawAction.Image: {
                  imageRef?.current?.click();
                  break;
                }
              }
            }}
            action={drawAction}
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
          <SecondaryActionButtons
            isUndoDisabled={historyIndexRef.current === -1}
            isRedoDisabled={
              historyIndexRef.current === canvasHistory?.length - 1
            }
            onActionChange={onSecondaryActionChange}
            zoom={zoom}
          />
        </Box>

        <Box cursor={cursor}>
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
              setStageXY({ x: e.target.x(), y: e.target.y() });
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
              {[...drawings, currentlyDrawnShape].map((drawing) => {
                if (drawing?.name === DrawAction.Rectangle) {
                  return <KonvaRect {...drawing} {...getShapeProps(drawing)} />;
                }
                if (drawing?.name === DrawAction.Circle) {
                  return (
                    <KonvaCircle {...drawing} {...getShapeProps(drawing)} />
                  );
                }
                if (drawing?.name === DrawAction.Line) {
                  return <KonvaLine {...drawing} {...getShapeProps(drawing)} />;
                }
                if (drawing?.name === DrawAction.Arrow) {
                  return (
                    <KonvaArrow
                      {...(drawing as ArrowConfig)}
                      {...getShapeProps(drawing)}
                    />
                  );
                }
                if (drawing?.name === DrawAction.Image) {
                  return (
                    <KonvaImage
                      {...(drawing as ImageConfig)}
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
      </Box>
    );
  }
);
