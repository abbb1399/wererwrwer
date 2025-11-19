import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { token } from "@atlaskit/tokens";

import { type ColumnType } from "../../data/people";

import { useBoardContext } from "./board-context";
import { Card } from "./card";
import { ColumnContext, type ColumnContextProps } from "./column-context";

/**
 * Note: not making `'is-dragging'` a `State` as it is
 * a _parallel_ state to `'is-column-over'`.
 *
 * Our board allows you to be over the column that is currently dragging
 */
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

// preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);

    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current,
        },
      }),

      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes("AppleWebKit") &&
            !navigator.userAgent.includes("Chrome");

          if (!isSafari) {
            setState({ type: "generate-column-preview" });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "generate-safari-column-preview",
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),

      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === "column"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          // skip react re-render if edge is not changing
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      })
    );
  }, [columnId, registerColumn, instanceId]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((userId: string) => {
    return stableItems.current.findIndex((item) => item.userId === userId);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        data-testid={`column-${columnId}`}
        ref={columnRef}
        className={`flex flex-col w-[250px] bg-gray-100 rounded-2xl transition-all duration-300 ease-in-out relative ${
          state.type === "idle"
            ? "cursor-grab"
            : state.type === "is-card-over"
            ? "bg-blue-100"
            : state.type === "generate-column-preview"
            ? "isolate"
            : ""
        }`}
      >
        {/* This element takes up the same visual space as the column.
          We are using a separate element so we can have two drop targets
          that take up the same visual space (one for cards, one for columns)
        */}
        <div className="flex flex-col min-h-0 grow" ref={columnInnerRef}>
          <div
            className={`flex flex-col min-h-0 grow ${
              isDragging ? "opacity-40" : ""
            }`}
          >
            <div
              className="flex flex-row justify-between items-center ps-4 pe-4 pt-2 text-gray-500 select-none"
              ref={headerRef}
              data-testid={`column-header-${columnId}`}
            >
              <span
                className="text-xs font-semibold"
                data-testid={`column-header-title-${columnId}`}
              >
                {column.title}
              </span>
            </div>
            <div className="h-full overflow-y-auto" ref={scrollableRef}>
              <div className="flex flex-col box-border min-h-full p-2 gap-2">
                {column.items.map((item) => (
                  <Card item={item} key={item.userId} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {state.type === "is-column-over" && state.closestEdge && (
          <DropIndicator
            edge={state.closestEdge}
            gap={token("space.200", "0")}
          />
        )}
      </div>
      {state.type === "generate-safari-column-preview"
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
});

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <div className="w-[250px] bg-gray-100 rounded ps-4 pe-4 pt-2 p-4 text-gray-500 select-none">
      <span className="text-xs font-semibold">{column.title}</span>
    </div>
  );
}
