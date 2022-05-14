export { useDraggable } from "./useDraggable";
export { useDraggableContext } from "./useDraggableContext";
export { Draggable } from "./Draggable";

export const moveItems = (items: any[], activeIndex: number, desiredIndex: number) => {
  const draftItems = [...items];
  const activeItem = draftItems[activeIndex]!;
  draftItems.splice(activeIndex, 1);
  draftItems.splice(desiredIndex, 0, activeItem);
  return draftItems;
};
