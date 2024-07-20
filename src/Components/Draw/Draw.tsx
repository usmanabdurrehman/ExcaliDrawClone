import { Box, Flex } from "@chakra-ui/react";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect as KonvaRect, Transformer } from "react-konva";
import { DrawAction } from "../../constants";

interface DrawProps {}

export const Draw: React.FC<DrawProps> = React.memo(function Draw({}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<any>();

  const [bgFill, setBgFill] = useState("#ffffff");

  const transformerRef = useRef<any>(null);

  const [drawings, setDrawings] = useState<NodeConfig[]>([]);
  const [currentlyDrawnShape, setCurrentlyDrawnShape] = useState<NodeConfig>();

  const [drawAction, setDrawAction] = useState<DrawAction>(DrawAction.Scribble);

  const backgroundRef = useRef<any>(null);

  const [{ viewWidth, viewHeight }, setViewMeasures] = useState<{
    viewHeight: number | undefined;
    viewWidth: number | undefined;
  }>({
    viewHeight: undefined,
    viewWidth: undefined,
  });

  useEffect(() => {
    if (containerRef.current) {
      setViewMeasures({
        viewHeight: containerRef.current.offsetHeight,
        viewWidth: containerRef.current.offsetWidth,
      });
    }
  }, [containerRef]);

  return (
    <Box ref={containerRef} pos="relative" height="100vh" width="100vw">
      <Box>
        <Stage
          ref={stageRef}
          // onMouseUp={onStageMouseUp}
          // draggable={isStageDraggable}
          // onMouseDown={onStageMouseDown}
          // onMouseMove={onStageMouseMove}
          // onClick={onStageClick}
          onDragMove={() => {
            backgroundRef?.current?.absolutePosition({ x: 0, y: 0 });
          }}
          height={viewHeight}
          width={viewWidth}
        >
          <Layer>
            <KonvaRect
              ref={backgroundRef}
              x={0}
              y={0}
              fill={bgFill}
              id="bg"
              listening={false}
              height={viewHeight}
              width={viewWidth}
            />
            {[...drawings, currentlyDrawnShape]
              .map((drawing) => {
                return null;
              })
              .filter((item) => !!item)}

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
          </Layer>
        </Stage>
      </Box>
    </Box>
  );
});
