import { forwardRef, type ReactNode, type CSSProperties } from "react";

export interface BoxProps {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?:
    | "div"
    | "span"
    | "section"
    | "article"
    | "aside"
    | "header"
    | "footer"
    | "main"
    | "nav"
    | "small";
  /**
   * Elements to be rendered inside the Box.
   */
  children: ReactNode;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Inline styles.
   */
  style?: CSSProperties;
  /**
   * The HTML id attribute.
   */
  id?: string;
  /**
   * Test ID for testing purposes.
   */
  testId?: string;
}

/**
 * __Box__
 *
 * Box is a primitive component that can be used as a generic container.
 *
 * @example
 * ```tsx
 *  <Box className="p-4 bg-gray-100">
 *    Content
 *  </Box>
 * ```
 */
export const Box = forwardRef<HTMLElement, BoxProps>(
  (
    { as: Component = "div", children, className = "", style, id, testId },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={className}
        style={style}
        id={id}
        data-testid={testId}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = "Box";
