// slimmer type definition than @types/styled-components
// this compiles faster

declare module "styled-components" {
  export const css: StyledCSSFunction;
  const styled: Styled;
  export = styled;
}

declare module "styled-components/macro" {
  export const css: StyledCSSFunction;
  const styled: Styled;
  export = styled;
}

type StyledComponentFactory = {
  [E in "div" | "button" | "input" | "header" | "p" | "dialog" | "span" | "img" | "form" | "b" | "small" | "label"]: <
    Props = {}
  >(
    string: TemplateStringsArray,
    ...interpolations: Interpolations<Props>
  ) => React.FunctionComponent<JSX.IntrinsicElements[E] & Props & { theme?: any }> & { [isStyled]: true };
};

interface Styled extends StyledComponentFactory {
  <Props>(styledComponent: React.FunctionComponent<Props>): (
    string: TemplateStringsArray,
    ...interpolations: Interpolations<Props>
  ) => React.FunctionComponent<Props> & { [isStyled]: true };
}

type Interpolations<Props> = Array<
  string | number | ((props: Props & { theme?: any }) => string | number) | { [isStyled]: true }
>;

const isStyled = Symbol();

type StyledCSSFunction = (string: TemplateStringsArray, ...interpolations: Array<string | number>) => any;
