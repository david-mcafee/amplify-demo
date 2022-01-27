import React from "react";
// import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
import Link from "@mui/material/Link";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import Tooltip from "@mui/material/Tooltip";
import { Analytics } from "aws-amplify";
import { AmplifySignOut } from "@aws-amplify/ui-react/legacy";
// import { useStyles } from "./styles";
import { Link as RouterLink } from "react-router-dom";

type NavProps = {
  readonly username: string;
};

const Nav = ({ username }: NavProps) => {
  // const { navContainer } = useStyles();
  // const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
  //   null
  // );
  // const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
  //   null
  // );

  // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  // const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElUser(event.currentTarget);
  // };

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null);
  // };

  // const handleCloseUserMenu = () => {
  //   setAnchorElUser(null);
  // };

  function testAnalyticsButton() {
    Analytics.record({
      name: "test button click",
      metrics: { clickNumber: 1 },
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography>{`Welcome ${username}!`}</Typography>
          <Divider />
          <Link color="rgb(255,255,255)" component={RouterLink} to="/">
            GraphQL API
          </Link>
          <Divider />
          <Link color="rgb(255,255,255)" component={RouterLink} to="/chatbot">
            Chatbot
          </Link>
          <Divider />
          <Link color="rgb(255,255,255)" component={RouterLink} to="/lambda">
            Lambda
          </Link>
          <Divider />
          <Link color="rgb(255,255,255)" component={RouterLink} to="/pubsub">
            PubSub
          </Link>
          <Divider />
          <Link color="rgb(255,255,255)" component={RouterLink} to="/storage">
            Storage
          </Link>
          <Divider />
          <Link
            color="rgb(255,255,255)"
            component={RouterLink}
            to="/amplify-ui"
          >
            Amplify UI
          </Link>
          <Divider />
          <Button onClick={testAnalyticsButton}>Test Analytics</Button>
          <Divider />
          <AmplifySignOut />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
