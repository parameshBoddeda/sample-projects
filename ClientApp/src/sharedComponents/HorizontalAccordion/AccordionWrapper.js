import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  card: {
    marginRight: theme.spacing(1),
    display: "inline-flex",
    position: "relative",
    "&:last-child": {
      marginRight: theme.spacing(0),
    },
  },
  cardHalfWidth: { width: "calc(50% - 4px)" },
  cardOneThirdWidth: {
    width: "calc(30% - 4px)",
    "& .MuiCollapse-root": {
      maxHeight: "calc(100vh - 216px)",
    },
    "& .MuiCardActions-root": {
      maxHeight: "calc(100vh - 216px)",
    },
  },
  cardTwoThirdWidth: {
    width: "calc(70% - 4px)",
    "& > .MuiCollapse-root": {
      maxHeight: "calc(100vh - 216px)",
    },
    "& > .MuiCardActions-root": {
      maxHeight: "calc(100vh - 216px)",
    },
  },
  cardBar: { width: "36px" },
  cardFullWidth: {
    width: "calc(100% - 44px)",
    "&:only-child": {
      width: "100%",
    },
  },
  CardActions: {
    padding: theme.spacing(0) + "px !important",
    maxWidth: 36,
    height: "calc(100vh - 128px)",
    alignItems: "flex-start !important",
    justifyContent: "center",
  },
  IconFont: { fontSize: "1rem !important" },
  AccordionTitle: {
    transform: "rotate(-90deg)",
    position: "relative",
    top: "60px !important",
    whiteSpace: "nowrap",
    display: "flex",
    flex: "1",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    height: "36px",
  },
  ExpandCollapse: {
    position: "absolute !important",
    right: "2px",
    top: "0",
  },
  TraffickingBG: {
    background: "transparent !important",
    boxShadow: "none !important",
  },
  Collapse: {
    width: "100% !important",
    maxHeight: "calc(100vh - 128px)",
    "& .MuiCollapse-wrapper": {
      width: "100%",
      "& .MuiCollapse-wrapperInner": {
        width: "100%",
      },
    },
  },
  CardContent: { padding: theme.spacing(0) + "px !important" },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AccordionHorizontal = (props) => {
  const classes = useStyles();
  return (
    <>
      {!props.showDifferentSizes && (
        <Card
          square
          className={`${classes.card} ${
            props.resize
              ? classes.cardHalfWidth
              : props.Expanded
              ? classes.cardFullWidth
              : classes.cardBar
          } ${
            props.addTraffickingClass && props.Expanded
              ? classes.TraffickingBG
              : ""
          }`}
        >
          {!props.hideExpandButton && (
            <CardActions disableSpacing className={classes.CardActions}>
              <ExpandMore
                expand={props.Expanded}
                onClick={props.handleExpand}
                aria-expanded={props.Expanded}
                aria-label="show more"
                className={classes.ExpandCollapse}
              >
                {props.Expanded ? (
                  <CloseFullscreenIcon className={classes.IconFont} />
                ) : (
                  <OpenInFullIcon className={classes.IconFont} />
                )}
              </ExpandMore>
              {!props.Expanded && (
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  className={classes.AccordionTitle}
                >
                  {props.accordionTitle}
                </Typography>
              )}
            </CardActions>
          )}
          <Collapse
            in={props.Expanded}
            timeout="auto"
            unmountOnExit
            orientation="horizontal"
            className={classes.Collapse}
          >
            <CardContent className={classes.CardContent}>
              <Typography paragraph>{props.children}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      )}
      {props.showDifferentSizes && (
        <Card
          square
          className={`${classes.card} ${
            props.resize && !props.showDifferentSizes
              ? classes.cardHalfWidth
              : props.size === "oneThird"
              ? classes.cardOneThirdWidth
              : classes.cardTwoThirdWidth
          }`}
        >
          {!props.hideExpandButton && (
            <CardActions disableSpacing className={classes.CardActions}>
              <ExpandMore
                expand={props.Expanded}
                onClick={props.handleExpand}
                aria-expanded={props.Expanded}
                aria-label="show more"
                className={classes.ExpandCollapse}
              >
                {props.Expanded ? (
                  <CloseFullscreenIcon className={classes.IconFont} />
                ) : (
                  <OpenInFullIcon className={classes.IconFont} />
                )}
              </ExpandMore>
              {!props.Expanded && (
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  className={classes.AccordionTitle}
                >
                  {props.accordionTitle}
                </Typography>
              )}
            </CardActions>
          )}
          <Collapse
            in={props.Expanded}
            timeout="auto"
            unmountOnExit
            orientation="horizontal"
            className={classes.Collapse}
          >
            <CardContent className={classes.CardContent}>
              <Typography paragraph>{props.children}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      )}
    </>
  );
};

AccordionHorizontal.displayName = "HorizontalAccordion";
export default AccordionHorizontal;
