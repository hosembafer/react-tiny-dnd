import { DraggableContextType } from "./types";

export const useDraggable = (context: DraggableContextType, index: number) => {
  const { setDragIndex } = context;
  const handler = () => setDragIndex(index);
  const listeners = {
    onMouseDown: handler,
    onTouchStart: handler,
  };

  const isDragging = context.isDragging && index === context.dragIndex;

  return {
    listeners,
    isDragging,
  };
};
