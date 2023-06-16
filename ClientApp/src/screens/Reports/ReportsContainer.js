import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import {
  AppBar,
  Box,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

import SubHeader from "../../sharedComponents/SubHeader/SubHeader";
import AppDataContext from "../../common/AppContext";
import ViewReport from "./ViewReport";
import {
  GetReportsList,
  GetReportsConfig,
} from "../../services/reports.service";
import Dropdown from "../../sharedComponents/Dropdown/Dropdown";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },

  moduleWidth: {
    width: "270px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

function ReportsContainer(props) {
  const classes = useStyles();
  const { userPermissions, leagueInfo } = useContext(AppDataContext);
  const [reports, setReports] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [modules, setModules] = useState([]);
  const { moduleNames } = useContext(AppDataContext);
  const [moduleName, setModuleName] = useState({
    label: "",
    value: "",
  });

  useEffect(() => {
    if (moduleNames && moduleNames.length > 0) {
      let list = moduleNames.map((item) => {
        return { label: item.lookupText, value: item.lookupId };
      });
      setModules(list);
    }
  }, [moduleNames]);

  useEffect(() => {
    GetReportsList()
      .then((data) => {
        setReports(data);
      })
      .catch((err) => {
        console.log(err);
      });

    setModuleName({
      label: "Master Data",
      value: 1701,
    });
  }, []);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleModuleChange = (name, value) => {
    setTabIndex(-1);
    setModuleName(value);
    GetReportsConfig(value.value)
      .then((data) => {
        setReports(data);
        setTabIndex(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={classes.root} style={{ paddingTop: "10px" }}>
      <SubHeader headerText="REPORTS">
        <Box className={classes.moduleWidth}>
          <Dropdown
            name="moduleId"
            fullWidth
            value={moduleName}
            size="small"
            id="moduleId"
            variant="outlined"
            showLabel={true}
            lbldropdown="Modules"
            ddData={modules}
            handleChange={handleModuleChange}
          />
        </Box>
      </SubHeader>

      {/* <Typography pl={10} pt={3} >Content Goes Here.</Typography>  Remove this once reports are ready */}
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="false">
          <Grid container>
            <Grid items lg={12} md={12} sm={12} xs={12}>
              <Tabs
                value={tabIndex}
                onChange={handleChange}
                scrollButtons="auto"
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                aria-label="report tabs"
                className={classes.tabsColor}
              >
                {reports.map((item, i) => {
                  return (
                    <Tab
                      key={i}
                      index={i}
                      value={i}
                      wrapped
                      icon={<AssessmentOutlinedIcon />}
                      label={
                        <Typography variant="caption" color="primary">
                          {item.reportName}
                        </Typography>
                      }
                      {...a11yProps(i)}
                    />
                  );
                })}
              </Tabs>
            </Grid>
          </Grid>
        </Container>
      </AppBar>

      {reports.map((item, i) => {
        return (
          <TabPanel value={tabIndex} key={i} index={i}>
            <ViewReport url={item.url.replace("<LeagueName>", leagueInfo)} />
          </TabPanel>
        );
      })}
    </div>
  );
}

export default withRouter(ReportsContainer);
