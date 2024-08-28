import { Box } from "@chakra-ui/react";
import { Circle as CircleI } from "konva/lib/shapes/Circle";
import { LineConfig } from "konva/lib/shapes/Line";
import React, {
  LegacyRef,
  MutableRefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import { Circle, Layer, Line, Stage } from "react-konva";

interface MultiPointLineProps extends LineConfig {
  onPointDrag: (updateFn: (prevPoints: number[]) => number[]) => void;
  activatePoints: boolean;
}

export default function MultiPointLine({
  points,
  onPointDrag,
  activatePoints,
  ...rest
}: MultiPointLineProps) {
  //   const [points, setPoints] = useState([20, 20, 100, 100, 50, 150]);

  const mappedPoints = useMemo(() => {
    if (!activatePoints) return [];
    const mappedPoints: { x?: number; y?: number }[] = [];

    for (let i = 0; i < (points?.length || 0); i = i + 2) {
      mappedPoints.push({ x: points?.[i], y: points?.[i + 1] });
    }
    return mappedPoints;
  }, [points, activatePoints]);

  // console.log({ points, mappedPoints, activatePoints });

  const hoverRef = useRef<any>(null);

  return (
    // <Box m={6}>
    //   <Stage height={400} width={400}>
    //     <Layer>
    <>
      <Line
        stroke={"black"}
        strokeWidth={2}
        points={points}
        tension={0.5}
        {...rest}
      />
      <Circle radius={9} fill="#afabee" ref={hoverRef} visible={false} />
      {mappedPoints.map((point, index) => (
        <Circle
          radius={5}
          strokeWidth={1}
          fill="white"
          stroke="#8986E3"
          x={point.x}
          y={point.y}
          draggable
          onMouseOver={(e) => {
            document.body.style.cursor = "pointer";
            hoverRef?.current?.setAttrs({
              x: e.target.x(),
              y: e.target.y(),
              visible: true,
            });
            // e.target.setAttrs({
            //   strokeWidth: 6,
            //   stroke: "#dddcee",
            // });
          }}
          onMouseOut={(e) => {
            document.body.style.cursor = "default";
            hoverRef?.current?.setAttrs({
              visible: false,
            });
          }}
          onDragMove={(e) => {
            const x = e.target.x();
            const y = e.target.y();

            onPointDrag((prevPoints) => {
              const pointsArr = [...prevPoints];

              pointsArr[index * 2] = x;
              pointsArr[index * 2 + 1] = y;
              return pointsArr;
            });
            hoverRef?.current?.setAttrs({
              x: e.target.x(),
              y: e.target.y(),
              visible: true,
            });
          }}
        />
      ))}
    </>
    //     </Layer>
    //   </Stage>
    // </Box>
  );
}
