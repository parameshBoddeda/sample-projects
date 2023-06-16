import * as React from "react";
import TraffickingDomesticContainer from "./Domestic/TraffickingDomesticContainer";
import TraffickingInternationalContainer from "./International/TraffickingInternationalContainer";
import TrafficRosContainer from "./ROS/TrafficRosContainer";

const TraffickingContainer = (props) => {
    return <>

        {(props.selectedScheduleData.marketTypeId === 111 || props.selectedScheduleData.marketTypeId === 112) 
            && props.selectedScheduleData.isROS &&
            <TrafficRosContainer selectedScheduleId={props.selectedScheduleId}
            showTraffickLetter={props.showTraffickLetter}
                view={props.view} selectedScheduleData={props.selectedScheduleData}
                setFilterData={props.setFilterData} rows={props.rows}
                originalData={props.originalData}
                refreshPage={props.refreshPage}
            />
        }

        {props.selectedScheduleData.marketTypeId === 111 && !props.selectedScheduleData.isROS &&
            <TraffickingDomesticContainer selectedScheduleId={props.selectedScheduleId}
            showTraffickLetter={props.showTraffickLetter}
                view={props.view} selectedScheduleData={props.selectedScheduleData}
                setFilterData={props.setFilterData} rows={props.rows}
                originalData={props.originalData}
                refreshPage={props.refreshPage}
            />
        }

        {props.selectedScheduleData.marketTypeId === 112 &&
            <TraffickingInternationalContainer selectedScheduleId={props.selectedScheduleId}
            showTraffickLetter={props.showTraffickLetter}
                view={props.view} selectedScheduleData={props.selectedScheduleData}
                setFilterData={props.setFilterData} rows={props.rows}
                originalData={props.originalData}
                refreshPage={props.refreshPage}
            />
        }

    </>
}

TraffickingContainer.displayName = "TraffickingContainer";
export default TraffickingContainer;