import { RefObject, TouchEvent, useCallback, useEffect, useMemo, useState } from "react";
import { DraggableType, DraggableContextType } from "./types";

const between = (x: number, from: number, to: number) => x > from && x < to;

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return "touches" in event;
};

const aggregateTouchAndMouseEvent = (event: MouseEvent | TouchEvent): Partial<TouchInit | MouseEventInit> => {
  let clientY;
  if (isTouchEvent(event)) {
    clientY = event.touches[0].clientY;
  } else if (event instanceof MouseEvent) {
    clientY = event.clientY;
  }
  return {
    clientY,
  };
};

export const useDraggableContext = ({
  onDrop,
  snapThreshold = 24,
}: {
  onDrop: (dragIndex: number, overIndex: number) => void;
  snapThreshold?: number;
}) => {
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const [overIndex, setOverIndex] = useState(-1);
  const [items, setItems] = useState<DraggableType[]>([]);
  const [doesMouseMoved, setDoesMouseMoved] = useState(false);
  const [mousePressedY, setMousePressedY] = useState();
  const isDragging = dragIndex !== -1 && doesMouseMoved;

  const onMove = useCallback((event: MouseEvent | TouchEvent) => {
    // event.preventDefault();

    const { clientY } = aggregateTouchAndMouseEvent(event);

    const hasMovedEnough = mousePressedY !== undefined && clientY !== undefined && Math.abs(mousePressedY - clientY) > 5;
    if (hasMovedEnough) {
      setDoesMouseMoved(true);
    }

    if (isDragging && !!items.length) {
      const sortedItems = [...items].sort((a, b) => a.order - b.order);
      let points = sortedItems
        .map((item) => {
          const node = item.refInstance.current;
          const { y, height } = node?.getBoundingClientRect() ?? { y: 0, height: 0 };
          return y + height;
        });

      const node = sortedItems[0].refInstance.current;
      const { y } = node?.getBoundingClientRect() ?? { y: 0, height: 0 };
      points = [y, ...points];
      let newOrder = points.findIndex((point) => {
        const from = point - snapThreshold;
        const to = point + snapThreshold;

        return clientY !== undefined && between(clientY, from, to);
      });

      setOverIndex(newOrder);
    }
  }, [isDragging, items, snapThreshold, mousePressedY]);

  const onMouseUp = useCallback(() => {
    setDragIndex(-1);
    setOverIndex(-1);

    setDoesMouseMoved(false);
    setMousePressedY(undefined);

    if (overIndex === -1) return;
    let indexShift = 0;
    if (dragIndex < overIndex) {
      indexShift = -1;
    }
    onDrop(dragIndex, overIndex + indexShift);
  }, [dragIndex, overIndex, onDrop]);

  const onMouseDown = useCallback((event) => {
    setMousePressedY(event.clientY);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("touchstart", onMouseDown);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);

      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("touchstart", onMouseDown);
    };
  }, [onMouseUp]);

  useEffect(() => {
    document.body.style.cursor = isDragging ? "row-resize" : "initial";
  }, [isDragging]);

  const registerDraggable = useCallback((refInstance: RefObject<HTMLElement>, order: number) => {
    setItems((items) => {
      if (items.some((_, i) => i === order)) {
        return items
          .map((item, i) => {
            if (i === order) {
              return {
                refInstance,
                order,
              };
            } else {
              return item;
            }
          })
      } else {
        return [...items, { refInstance, order }];
      }
    });
  }, []);

  useEffect(() => {
    document.body.addEventListener("mousemove", onMove);
    // @ts-ignore
    document.body.addEventListener("touchmove", onMove, { passive: false });

    return () => {
      document.body.removeEventListener("mousemove", onMove);
      // @ts-ignore
      document.body.removeEventListener("touchmove", onMove);
    };
  }, [onMove]);

  const context = useMemo<DraggableContextType>(() => ({
    dragIndex,
    setDragIndex,
    registerDraggable,
    overIndex,
    isDragging,
  }), [dragIndex, registerDraggable, overIndex, isDragging]);

  return context;
};
