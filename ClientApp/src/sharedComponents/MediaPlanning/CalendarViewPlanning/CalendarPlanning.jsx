//Global Imports Start
import React, {useState, useEffect} from "react";
import { Container, Box } from "@mui/material";

//Global Imports End
//Regional Imports Start
import HeatMap from "../../../sharedComponents/HeatMap/HeatMap"
import LoadingAppUI from "../../emptyStateUIContainers/LoadingAppUI";
//Regional Import End

export default function CalendarPlanning(props) {

    const [scheduleData, setScheduleData] = useState([]);

    useEffect(()=>{
        if (props.Schedules && props.Schedules.length > 0)
            setScheduleData(props.Schedules);
    },[props.Schedules])

    return (
        <Container maxWidth={false} disableGutters>
            {props.IsLoading ? <LoadingAppUI /> : 
            <Box my={1} mx={1}>
                <HeatMap {...props} data={scheduleData} />
            </Box>}
        </Container>
    )
}
