import React, { useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import {
  Article,
  DashboardOutlined,
  InventoryOutlined,
  CreditCardOutlined,
  TvOutlined,
  CampaignOutlined,
  DvrOutlined,
  HistoryOutlined,
  DescriptionOutlined,
  ManageAccountsOutlined,
  FactCheckOutlined,
  PlayLessonOutlined,
} from "@mui/icons-material";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { Typography } from "@mui/material";
import DealListIcon from "../customIcons/DealListIcon";
import ISCIIcon from "../customIcons/ISCIIcon";
import CopyScheduleIcon from "../customIcons/CopyScheduleIcon";

import AppDataContext from "../../common/AppContext";
import Helper from "../../common/Helper";
import { ROLE } from "../../common/AppConstants";

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 0.5),
  minHeight: theme.spacing(6),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    "& .MuiDrawer-paper": {
      width: "calc(56px + 1px)",
      background: "#DFE3EC",
      color: "#394150",
    },
    "& .MuiButtonBase-root": {
      marginLeft: "0",
    },
    "& .MuiButtonBase-root.MuiListItem-root": {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(1.5),
      "&.active": {
        background: "#1d428a",
        color: "#fff",
        "& .MuiListItemIcon-root": {
          color: "#fff",
        },
      },
      "&.subActive": {
        background: "#1d428a",
        color: "#fff",
        "& .MuiListItemIcon-root": {
          color: "#fff",
        },
      },
    },
    "& .MuiListItemIcon-root": {
      minWidth: theme.spacing(7),
      color: "#394150",
      flexDirection: "column",
      alignItems: "center",
      "& .MuiTypography-root": {
        fontSize: ".4rem",
        wordBreak: "break-word",
        maxWidth: "48px",
        textAlign: "center",
        whiteSpace: "normal",
      },
    },
  },
  header: {
    position: "relative",
    zIndex: 10000,
  },
  menu: {
    width: "250px",
  },
  itemIcon: {
    minWidth: "35px",
  },
  avatar: {
    fontSize: "15px",
  },

  menuButton: {
    marginRight: theme.spacing(1),
  },
  marginLeft1: {
    marginLeft: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  appVersion: {
    marginLeft: theme.spacing(2),
    fontSize: "10px",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
}));

const MiniDrawer = (props) => {
  const theme = useTheme();
  const history = useHistory();
  const [active, setActive] = React.useState({ index: 0 });
  const [subActive, setSubActive] = React.useState();
  const [opensubmenu, setOpenSubMenu] = React.useState(false);
  const [open, setOpen] = React.useState();
  const [newItemList, setNewItemList] = React.useState([]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleExpandSubMenuClick = (index) => {
    setActive({ index: index });
    setOpenSubMenu(!opensubmenu);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    if (props.handleDrawerClose) {
      props.handleDrawerClose(false);
    }
  };

  const handleMenuClick = (path, index) => {
    let active = { index: index };
    setOpenSubMenu(false);
    setSubActive({});
    setActive(active);
    if (path !== "admin") {
      history.push(path);
    }
  };

  const handleSubMenuClick = (path, index) => {
    setSubActive({ index: index });
    history.push(path);
  };

  // role changes
  const { userPermissions, userClaims } = useContext(AppDataContext);

  const GetUserRole = () => {
    let result = !userPermissions
      ? ""
      : userPermissions
          .filter((p) => p.key === "Role")
          .map((x) => x.value)
          .shift();
    return result;
  };

  const CheckRole = (claimedRole) => {
    return Helper.CheckRole(GetUserRole(), claimedRole);
  };

  const CheckClaim = (permission) => {
    return Helper.CheckClaim(GetUserRole(), userClaims, permission);
  };

  const list = [
    {
      INVENTORY_MANAGEMENT: ["Dashboard", "Reports", "Inventory Management"],
    },
    {
      DIGITAL_INVENTORY_MANAGEMENT: [
        "Dashboard",
        "Reports",
        "Inventory Management",
      ],
    },
    {
      SALES_PLANNER: [
        "Dashboard",
        "Reports",
        "Inventory Management",
        "Rate Card",
        "Deals",
        "Media Planning",
        "Plan List",
      ],
    },
    {
      CAMPAIGN_PLANNER: [
        "Dashboard",
        "Reports",
        "Inventory Management",
        "Campaign Planning",
        "Plan Schedules",
        "Rate Card",
      ],
    },
    {
      LINEAR_TRAFFICKING: [
        "Dashboard",
        "Reports",
        "Inventory Management",
        "Trafficking",
        "ISCI Management",
      ],
      },
      {
          DIGITAL_TRAFFICKING: [
              "Dashboard",
              "Reports",
              "Inventory Management",
              "Digital Trafficking",
              "ISCI Management",
          ],
      },
    {
      RECONCILIATION: ["Dashboard", "Reports", "Reconciliation"],
      },
      {
          REPORTS: ["Dashboard", "Reports"],
      },
  ];

  const checkUserRoles = () => {
    let roles = [];
    for (let key in ROLE) {
      if (CheckRole(ROLE[key])) {
        roles.push(key);
      }
    }

    let allRoles = [];

    list.forEach((item) => {
      if (roles.includes(...Object.keys(item))) {
        allRoles.push(...Object.values(item)[0]);
      }
    });

    let currentRoles = [...new Set(allRoles)];

    if (currentRoles.length === 0) {
      let filtered = itemsList.filter((item) => item.text === "Dashboard");
      setNewItemList(filtered);
      return;
    }
    let filtered = itemsList.filter((item) => currentRoles.includes(item.text));

    setNewItemList(filtered);
  };

  useEffect(()=>{
    if (props.ResetLeftNav){
      setActive({ index: 0 });
    }
  }, [props.ResetLeftNav]);

  useEffect(() => {
    if (CheckRole(ROLE.ADMIN)) {
      setNewItemList(itemsList);

      return;
    } else {
      checkUserRoles();
    }    
  }, [userPermissions]);

  const classes = useStyles();
  const itemsList = [
    {
      text: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
      onClick: () => history.push("/"),
    },

    {
      text: "Inventory Management",
      icon: <InventoryOutlined />,
      path: "/linearinventory",
      onClick: () => history.push("/linearinventory"),
    },

    {
      text: "Rate Card",
      icon: <CreditCardOutlined />,
      path: "/ratecard",
      onClick: () => history.push("/ratecard"),
    },

    {
      text: "Deals",
      icon: <DealListIcon />,
      path: "/deals",
      onClick: () => history.push("/deals"),
    },

    {
      text: "Plan List",
      icon: <FactCheckOutlined />,
      path: "/mediaplans",
      onClick: () => history.push("/mediaplans"),
    },

    {
      text: "Media Planning",
      icon: <TvOutlined />,
      path: "/mediaplanning",
      onClick: () => history.push("/mediaplanning"),
    },

    {
      text: "Campaign Planning",
      icon: <CampaignOutlined />,
      path: "/campaignplanning",
      onClick: () => history.push("/campaignplanning"),
    },

    {
      text: "Trafficking",
      icon: <DvrOutlined />,
      path: "/trafficking",
      onClick: () => history.push("/trafficking"),
    },

    {
      text: "Digital Trafficking",
      icon: <PlayLessonOutlined />,
      path: "/digitaltrafficking",
      onClick: () => history.push("/digitaltrafficking"),
    },

    {
      text: "Plan Schedules",
      icon: <CopyScheduleIcon />,
      path: "/copyPlanSchedules",
      onClick: () => history.push("/copyPlanSchedules"),
    },

    {
      text: "ISCI Management",
      icon: <ISCIIcon />,
      path: "/manageIsci",
      onClick: () => history.push("/manageIsci"),
    },

    {
      text: "Reconciliation",
      icon: <HistoryOutlined />,
      path: "/reconciliation",
      onClick: () => history.push("/reconciliation"),
    },

    {
      text: "Reports",
      icon: <DescriptionOutlined />,
      path: "/reports",
      onClick: () => history.push("/reports"),
    },

    {
      text: "Administration",
      icon: <ManageAccountsOutlined />,
      isExpendable: true,
      onClick: () => handleSubMenuClick(),
      items: [
        {
          text: "Inventory Management",
          icon: <InventoryOutlined />,
          path: "/inventory",
          onClick: () => history.push("/inventory"),
        },

        {
          text: "Program Management",
          icon: <Article />,
          path: "/program",
          onClick: () => history.push("/program"),
        },

        {
          text: "Episode Management",
          icon: <Article />,
          path: "/episode",
          onClick: () => history.push("/episode"),
        },
        {
          text: "Season",
          icon: <Article />,
          path: "/admin/season",
          onClick: () => history.push("/admin/season"),
        },
      ],
    },
  ];

  return (
    <>
      <CssBaseline />
      <Drawer variant="permanent" open={open} className={classes.drawerPaper}>
        <div className={classes.toolbar} />
        <DrawerHeader>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              ...(open && { display: "none" }),
              width: "48px",
            }}
          >
            <MenuIcon />
          </IconButton>
          {open && (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List
          disablePadding
          sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {newItemList.length > 0 &&
            newItemList.map((item, index) => {
              const { text, icon, onClick, path } = item;
              {
                return (
                  <>
                    <ListItem
                      title={!open ? text : ""}
                      button
                      className={
                        active && active.index === index ? "active" : ""
                      }
                      key={`${text + index}`}
                      onClick={() =>
                        !item.isExpendable
                          ? handleMenuClick(path, index)
                          : handleExpandSubMenuClick(index)
                      }
                    >
                      {icon && (
                        <ListItemIcon key = {`NavIcon_${text + index}`}>                         
                          {icon}{" "}
                          {!open && (
                            <Typography variant="caption">{text}</Typography>
                          )}
                        </ListItemIcon>
                      )}
                      <ListItemText key={`NavItemText_${text + index}`} primary={text} />
                      {item.items && item.items.length > 0 ? (
                        opensubmenu ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                      ) : null}
                    </ListItem>

                    {item.items && item.items.length > 0 && (
                      <Collapse in={opensubmenu} timeout="auto" unmountOnExit>
                        <List disablePadding>
                          {item.items &&
                            item.items.map((ele, i) => {
                              return (
                                <ListItem
                                  title={!open ? ele.text : ""}
                                  button
                                  onClick={() =>
                                    handleSubMenuClick(ele.path, i)
                                  }
                                  className={
                                    subActive && subActive.index === i
                                      ? "subActive"
                                      : ""
                                  }
                                  key={`${ele.text + i}`}
                                >
                                  {icon && (
                                    <ListItemIcon>
                                      {ele.icon}{" "}
                                      {!open && (
                                        <Typography variant="caption">
                                          {ele.text}
                                        </Typography>
                                      )}
                                    </ListItemIcon>
                                  )}
                                  <ListItemText primary={ele.text} />
                                </ListItem>
                              );
                            })}
                        </List>
                      </Collapse>
                    )}
                  </>
                );
              }
            })}
        </List>
      </Drawer>
    </>
  );
};

MiniDrawer.displayName = "DrawerNavComponent";
export default withRouter(MiniDrawer);
