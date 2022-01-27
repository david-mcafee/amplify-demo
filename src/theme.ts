import { Theme } from "@aws-amplify/ui-react";

export const theme: Theme = {
  name: "my-theme",
  // customizations
  tokens: {
    colors: {
      font: {
        primary: { value: "green" },
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
