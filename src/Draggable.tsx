import React, { CSSProperties, FC, MouseEventHandler, ReactNode, TouchEventHandler, useEffect, useRef } from "react";
import { DraggableContextType } from "./types";

export type DraggableProps = {
  index: number;
  children: ReactNode;
  context: DraggableContextType;
  listeners?: { [key in string]: (MouseEventHandler | TouchEventHandler) };
};

type DragDividerProps = {
  visible: boolean;
  height?: number;
  align: "top" | "bottom";
};

const DragDivider: FC<DragDividerProps> = ({
  visible,
  height = 2,
  align,
}) => {
  let style: CSSProperties = {
    position: "absolute",
    width: "100%",
    backgroundColor: "#777",
    transition: "all 0.1s ease",
    height,
    [`${align}`]: (height / 2) + (align === "top" ? -1 : 0),
    visibility: visible ? "visible" : "hidden",
    opacity: visible ? 1 : 0,
  };

  return (
    <div style={style} />
  );
};

export const Draggable: FC<DraggableProps> = ({
  index,
  children,
  context,
  listeners,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    registerDraggable,
    overIndex,
    isDragging,
  } = context;

  useEffect(() => {
    registerDraggable(wrapperRef, index);
  }, [wrapperRef, registerDraggable, index]);

  return (
    <div
      ref={wrapperRef}
      {...(listeners ?? {})}
      style={{ position: "relative" }}
    >
      {isDragging && <DragDivider align='top' visible={overIndex === 0 && index === 0} />}

      {children}

      {isDragging && <DragDivider align='bottom' visible={overIndex - 1 === index} />}
    </div>
  );
};
