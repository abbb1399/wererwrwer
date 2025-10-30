import { forwardRef, type ReactNode } from "react";

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

type AlignBlock = "start" | "center" | "end" | "stretch" | "baseline";
type AlignInline = "start" | "center" | "end" | "stretch";
type Spread = "space-between" | "space-around" | "space-evenly";
type Grow = "fill" | "hug";

export interface InlineProps {
  /**
   * The DOM element to render as the Inline. Defaults to `div`.
   */
  as?: "div" | "span" | "ul" | "ol";
  /**
   * Used to align children along the block axis (typically vertical).
   */
  alignBlock?: AlignBlock;
  /**
   * Used to align children along the inline axis (typically horizontal).
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
  space?: Space;
  /**
   * Elements to be rendered inside the Inline.
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

/**
 * __Inline__
 *
 * Inline is a primitive component based on flexbox that manages the inline layout of direct children.
 *
 * @example
 * ```tsx
 *  <Inline space="space.100" alignBlock="center">
 *    <div>Item 1</div>
 *    <div>Item 2</div>
 *  </Inline>
 * ```
 */
export const Inline = forwardRef<HTMLElement, InlineProps>(
  (
    {
      as: Component = "div",
      alignBlock,
      alignInline,
      spread,
      grow,
      space,
      children,
      className = "",
      id,
      testId,
    },
    ref
  ) => {
    const classes = [
      "flex",
      "flex-row",
      space && spaceMap[space],
      alignBlock && alignBlockMap[alignBlock],
      alignInline && alignInlineMap[alignInline],
      spread && spreadMap[spread],
      grow && growMap[grow],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={classes}
        id={id}
        data-testid={testId}
      >
        {children}
      </Component>
    );
  }
);

Inline.displayName = "Inline";
