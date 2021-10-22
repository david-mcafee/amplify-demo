import { createUseStyles } from "react-jss";

import { maxWidth } from "../../shared/constants";

export const useStyles = createUseStyles({
  navContainer: {
    display: "flex",
    flexDirection: "row",
    margin: "0 !important",
  },
  [`@media (max-width: ${maxWidth}px)`]: {
    navContainer: {
      display: "flex",
      flexDirection: "column",
    },
  },
});
