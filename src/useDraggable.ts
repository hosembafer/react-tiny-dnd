import { DraggableContextType } from "./types";

export const useDraggable = (context: DraggableContextType, index: number) => {
  const { setDragIndex } = context;
  const listeners = {
    onMouseDown: () => setDragIndex(index),
  };

  const isDragging = context.isDragging && index === context.dragIndex;

  return {
    listeners,
    isDragging,
  };
};
