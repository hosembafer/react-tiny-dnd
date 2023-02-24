import React, { CSSProperties, FC, MouseEventHandler, ReactNode, TouchEventHandler, useCallback, useEffect, useRef } from "react";
import { DraggableContextType } from "./types";

export type DraggableProps = {
  index: number;
  children: ReactNode;
  context: DraggableContextType;
  listeners?: { [key in string]: (MouseEventHandler | TouchEventHandler) };
  preview?: ReactNode;
  dividerClassName?: string;
};

type DragDividerProps = {
  className?: string;
  height?: number;
  align: "top" | "bottom";
};

const DragDivider: FC<DragDividerProps> = ({
  className,
  height = 2,
  align,
}) => {
  let style: CSSProperties = {
    zIndex: 99999999999999999999,
    position: "absolute",
    width: "100%",
    backgroundColor: "#777",
    transition: "all 0.1s ease",
    height,
    [`${align}`]: (height / 2) + (align === "top" ? -1 : 0),
  };

  return (
    <div style={style} className={className} />
  );
};

export const Draggable: FC<DraggableProps> = ({
  index,
  children,
  context,
  listeners,
  preview,
  dividerClassName,
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
      {!!preview && isDragging && dragIndex === index && (
        <div ref={previewRef} style={{ display: isDragging && dragIndex === index ? "block" : "none", position: "fixed", zIndex: 9999999999999 }}>
          {preview}
        </div>
      )}

      {isDragging && overIndex === 0 && index === 0 && <DragDivider className={dividerClassName} align='top' />}

      {children}

      {isDragging && overIndex - 1 === index && <DragDivider className={dividerClassName} align='bottom' />}
    </div>
  );
};
