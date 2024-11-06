// needed to use css prop of styled-components

declare namespace React {
  interface DOMAttributes<T> {
    css?: any;
  }
}

// tried and not working solutions

// declare module "react" {
//   interface Attributes {
//     css?: any;
//   }
// }

// declare global {
//   namespace JSX {
//     interface IntrinsicAttributes {
//       css?: CSSProp;
//     }
//   }
// }

// declare module "react" {
//   interface DOMAttributes<T> {
//     css?: any;
//   }
// }
