import { KonvaEventObject, NodeConfig } from "konva/lib/Node";
import React, { useRef, useState } from "react";
import { CanvasAction, DrawAction } from "../constants";

export const useHistory = ({
  setDrawings,
  transformerRef,
}: {
  setDrawings: React.Dispatch<React.SetStateAction<NodeConfig[]>>;
  transformerRef: any;
}) => {
  const [canvasHistory, setCanvasHistory] = useState<
    {
      type: CanvasAction;
      drawAction: DrawAction | undefined;
      payload: any;
    }[]
  >([]);

  const historyIndexRef = useRef(-1);

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
    transformerRef?.current?.nodes([]);
    switch (lastAction?.type) {
      case CanvasAction.Add: {
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

  return {
    onTransformShapeStart,
    onTransformShapeEnd,
    onDragShapeEnd,
    onDragShapeStart,
    onHistory,
    updateCanvasHistory,
    historyIndexRef,
    canvasHistory,
  };
};
