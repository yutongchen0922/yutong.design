import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pixel-pet": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
