import { forwardRef, type ReactNode } from "react";

type Space = "space.0" | "space.050" | "space.100" | "space.150" | "space.200" | "space.250" | "space.300" | "space.400" | "space.500" | "space.600" | "space.800" | "space.1000";

type AlignBlock = "start" | "center" | "end" | "stretch" | "baseline";
type AlignInline = "start" | "center" | "end" | "stretch";
type Spread = "space-between" | "space-around" | "space-evenly";
type Grow = "fill" | "hug";
type Direction = "row" | "column";

export interface FlexProps {
  /**
   * The DOM element to render as the Flex. Defaults to `div`.
   */
  as?: "div" | "span" | "ul" | "ol" | "dl";
  /**
   * The direction of the flex container.
   */
  direction?: Direction;
  /**
   * Used to align children along the block axis.
   */
  alignBlock?: AlignBlock;
  /**
   * Used to align children along the inline axis.
   */
  alignInline?: AlignInline;
  /**
   * Used to distribute the children along the main axis.
   */
  spread?: Spread;
  /**
   * Used to set whether the container should grow to fill the available space.
   */
  grow?: Grow;
  /**
   * Represents the space between each child.
   */
  gap?: Space;
  /**
   * Column gap (horizontal spacing).
   */
  columnGap?: Space;
  /**
   * Row gap (vertical spacing).
   */
  rowGap?: Space;
  /**
   * Elements to be rendered inside the Flex.
   */
  children: ReactNode;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * The HTML id attribute.
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

const gapMap: Record<Space, string> = {
  "space.0": "gap-0",
  "space.050": "gap-1",
  "space.100": "gap-2",
  "space.150": "gap-3",
  "space.200": "gap-4",
  "space.250": "gap-5",
  "space.300": "gap-6",
  "space.400": "gap-8",
  "space.500": "gap-10",
  "space.600": "gap-12",
  "space.800": "gap-16",
  "space.1000": "gap-20",
};

const alignBlockMap: Record<AlignBlock, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const alignInlineMap: Record<AlignInline, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
};

const spreadMap: Record<Spread, string> = {
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

const growMap: Record<Grow, string> = {
  fill: "grow",
  hug: "",
};

const directionMap: Record<Direction, string> = {
  row: "flex-row",
  column: "flex-col",
};

/**
 * __Flex__
 *
 * Flex is a primitive component based on flexbox that manages the layout of direct children.
 *
 * @example
 * ```tsx
 *  <Flex direction="row" gap="space.100">
 *    <div>Item 1</div>
 *    <div>Item 2</div>
 *  </Flex>
 * ```
 */
export const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      as: Component = "div",
      direction = "row",
      alignBlock,
      alignInline,
      spread,
      grow,
      gap,
      columnGap,
      rowGap,
      children,
      className = "",
      id,
      testId,
    },
    ref
  ) => {
    const classes = [
      "flex",
      directionMap[direction],
      gap && gapMap[gap],
      alignBlock && alignBlockMap[alignBlock],
      alignInline && alignInlineMap[alignInline],
      spread && spreadMap[spread],
      grow && growMap[grow],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const style: React.CSSProperties = {};
    if (columnGap) {
      style.columnGap = spaceMap[columnGap];
    }
    if (rowGap) {
      style.rowGap = spaceMap[rowGap];
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

Flex.displayName = "Flex";

