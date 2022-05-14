import { RefObject } from 'react';

export type DraggableContextType = {
  dragIndex: number;
  setDragIndex: (dragIndex: number) => void;
  registerDraggable: (refInstance: RefObject<HTMLElement>, index: number) => void;
  overIndex: number;
  isDragging: boolean;
};

export type DraggableType = {
  refInstance: RefObject<HTMLElement>;
  order: number;
};
