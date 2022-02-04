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
    // components: {
    //   card: {
    //     // You can reference other tokens
    //     backgroundColor: { value: "yellow" },
    //     outlined: {
    //       // Or use explicit values
    //       borderWidth: { value: "10px" },
    //     },
    //     elevated: {
    //       boxShadow: { value: "{shadows.large.value}" },
    //     },
    //   },
    // },
  },
};
