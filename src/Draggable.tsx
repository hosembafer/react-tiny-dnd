import React, { CSSProperties, FC, MouseEventHandler, ReactNode, TouchEventHandler, useCallback, useEffect, useRef } from "react";
import { DraggableContextType } from "./types";

export type DraggableProps = {
  index: number;
  children: ReactNode;
  context: DraggableContextType;
  listeners?: { [key in string]: (MouseEventHandler | TouchEventHandler) };
  preview?: ReactNode;
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
  preview,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    registerDraggable,
    dragIndex,
    overIndex,
    isDragging,
  } = context;

  useEffect(() => {
    registerDraggable(wrapperRef, index);
  }, [wrapperRef, registerDraggable, index]);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (previewRef.current) {
      previewRef.current.style.top = event.pageY + "px";
      previewRef.current.style.left = event.pageX + "px";
    }
  }, [previewRef]);

  useEffect(() => {
    if (preview && isDragging && dragIndex === index) {
      document.body.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (preview && isDragging && dragIndex === index) {
        document.body.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [preview, isDragging, handleMouseMove, dragIndex, index]);

  return (
    <div
      ref={wrapperRef}
      {...(listeners ?? {})}
      style={{ position: "relative" }}
    >
      {!!preview && (
        <div ref={previewRef} style={{ display: isDragging && dragIndex === index ? "block" : "none", position: "fixed", zIndex: 9999999999999 }}>
          {preview}
        </div>
      )}

      {isDragging && <DragDivider align='top' visible={overIndex === 0 && index === 0} />}

      {children}

      {isDragging && <DragDivider align='bottom' visible={overIndex - 1 === index} />}
    </div>
  );
};
