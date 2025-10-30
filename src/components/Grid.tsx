import { forwardRef, type ReactNode, type CSSProperties } from "react";

type Space =
  | "space.0"
  | "space.050"
  | "space.100"
  | "space.150"
  | "space.200"
  | "space.250"
  | "space.300"
  | "space.400"
  | "space.500"
  | "space.600"
  | "space.800"
  | "space.1000";

type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "stretch";

type JustifyItems = "start" | "center" | "end" | "stretch";

type AlignItems = "start" | "center" | "baseline" | "end";

type AlignContent =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "stretch";

type AutoFlow = "row" | "column" | "dense" | "row dense" | "column dense";

export interface GridProps {
  /**
   * The DOM element to render as the Grid. Defaults to `div`.
   */
  as?: "div" | "span" | "ul" | "ol";
  /**
   * Used to align children along the inline axis.
   */
  justifyContent?: JustifyContent;
  /**
   * Used to align the grid along the inline axis.
   */
  justifyItems?: JustifyItems;
  /**
   * Used to align children along the block axis.
   */
  alignItems?: AlignItems;
  /**
   * Used to align the grid along the block axis.
   */
  alignContent?: AlignContent;
  /**
   * Represents the space between each column.
   */
  columnGap?: Space;
  /**
   * Represents the space between each child across both axes.
   */
  gap?: Space;
  /**
   * Represents the space between each row.
   */
  rowGap?: Space;
  /**
   * Specifies how auto-placed items get flowed into the grid.
   */
  autoFlow?: AutoFlow;
  /**
   * CSS `grid-template-rows`.
   */
  templateRows?: string;
  /**
   * CSS `grid-template-columns`.
   */
  templateColumns?: string;
  /**
   * CSS `grid-template-areas`.
   */
  templateAreas?: string[];
  /**
   * Elements to be rendered inside the grid.
   */
  children: ReactNode;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * HTML id attribute.
   */
  id?: string;
  /**
   * Test ID for testing purposes.
   */
  testId?: string;
}

const spaceMap: Record<Space, string> = {
  "space.0": "0",
  "space.050": "0.25rem",
  "space.100": "0.5rem",
  "space.150": "0.75rem",
  "space.200": "1rem",
  "space.250": "1.25rem",
  "space.300": "1.5rem",
  "space.400": "2rem",
  "space.500": "2.5rem",
  "space.600": "3rem",
  "space.800": "4rem",
  "space.1000": "5rem",
};

const justifyContentMap: Record<JustifyContent, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
  stretch: "justify-stretch",
};

const justifyItemsMap: Record<JustifyItems, string> = {
  start: "justify-items-start",
  center: "justify-items-center",
  end: "justify-items-end",
  stretch: "justify-items-stretch",
};

const alignItemsMap: Record<AlignItems, string> = {
  start: "items-start",
  center: "items-center",
  baseline: "items-baseline",
  end: "items-end",
};

const alignContentMap: Record<AlignContent, string> = {
  start: "content-start",
  center: "content-center",
  end: "content-end",
  "space-between": "content-between",
  "space-around": "content-around",
  "space-evenly": "content-evenly",
  stretch: "content-stretch",
};

const autoFlowMap: Record<AutoFlow, string> = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
  "row dense": "grid-flow-row-dense",
  "column dense": "grid-flow-col-dense",
};

/**
 * __Grid__
 *
 * Grid is a primitive component that implements the CSS Grid API.
 *
 * @example
 * ```tsx
 *  <Grid gap="space.100" templateColumns="1fr 1fr">
 *    <div>Item 1</div>
 *    <div>Item 2</div>
 *  </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Component = "div",
      justifyContent,
      justifyItems,
      alignItems,
      alignContent,
      columnGap,
      gap,
      rowGap,
      autoFlow,
      templateRows,
      templateColumns,
      templateAreas,
      children,
      className = "",
      id,
      testId,
    },
    ref
  ) => {
    const classes = [
      "grid",
      justifyContent && justifyContentMap[justifyContent],
      justifyItems && justifyItemsMap[justifyItems],
      alignItems && alignItemsMap[alignItems],
      alignContent && alignContentMap[alignContent],
      autoFlow && autoFlowMap[autoFlow],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const style: CSSProperties = {};

    if (gap) {
      style.gap = spaceMap[gap];
    }
    if (columnGap) {
      style.columnGap = spaceMap[columnGap];
    }
    if (rowGap) {
      style.rowGap = spaceMap[rowGap];
    }
    if (templateRows) {
      style.gridTemplateRows = templateRows;
    }
    if (templateColumns) {
      style.gridTemplateColumns = templateColumns;
    }
    if (templateAreas) {
      style.gridTemplateAreas = templateAreas.map((area) => `"${area}"`).join(" ");
    }

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={classes}
        style={Object.keys(style).length > 0 ? style : undefined}
        id={id}
        data-testid={testId}
      >
        {children}
      </Component>
    );
  }
);

Grid.displayName = "Grid";

