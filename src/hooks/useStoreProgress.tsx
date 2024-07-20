import { Node, NodeConfig } from "konva/lib/Node";
import { useCallback, useEffect, useRef } from "react";
import { DrawAction } from "../constants";
import { downloadURI, openDB } from "../utilities";
export const useStoreProgress = ({
  setDrawings,
  drawings,
}: {
  setDrawings: React.Dispatch<React.SetStateAction<NodeConfig[]>>;
  drawings: NodeConfig[];
}) => {
  const timeoutRef = useRef<number | null>(null);

  const storeDrawingState = useCallback(() => {
    localStorage.setItem("drawing", JSON.stringify({ drawings }));
  }, [drawings]);

  const downloadDrawingState = useCallback(() => {
    const fileName = "drawing-state.json";
    const json = JSON.stringify({ drawings }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    downloadURI(href, fileName);
  }, [drawings]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      storeDrawingState();
    }, 1200);
  }, [storeDrawingState]);

  useEffect(() => {
    const { drawings = [] } = JSON.parse(
      localStorage.getItem("drawing") || "{}"
    );
    const request = openDB();
    request.onsuccess = () => {
      const db = request.result;

      const tx = db.transaction("images", "readonly");
      const userData = tx.objectStore("images");
      const images = userData.getAll();

      images.onsuccess = () => {
        const imagesArray = images.result;
        setDrawings(
          drawings.map((drawing: NodeConfig) => {
            if (drawing.name === DrawAction.Image) {
              const image = new Image();
              const imageObj = imagesArray?.find(
                (image) => image.id === drawing.id
              );
              image.src = imageObj?.dataURL;
              return { ...drawing, image };
            }
            return drawing;
          })
        );
      };

      tx.oncomplete = function () {
        db.close();
      };
    };
  }, []);

  const resetCanvas = () => {
    localStorage.setItem("drawing", "{}");
    setDrawings([]);
  };

  const loadCanvas = (drawingFile: string) => {
    const { drawings = [] } = JSON.parse(drawingFile || "{}");
    console.log({ drawings });
    setDrawings(drawings);
    localStorage.setItem("drawing", drawingFile);
  };

  return { downloadDrawingState, resetCanvas, loadCanvas };
};
