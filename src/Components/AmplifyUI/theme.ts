import { Theme } from "@aws-amplify/ui-react";
// import { breakpoints } from "./breakpoints";

export const theme: Theme = {
  name: "my-theme",
  // breakpoints,
  // customizations,
  tokens: {
    colors: {
      font: {
        primary: { value: "red" },
        secondary: { value: "hotpink" },
      },
    },
    fonts: {
      default: {
        variable: { value: "Raleway, sans-serif" },
        static: { value: "Raleway, sans-serif" },
      },
    },
  },
};
