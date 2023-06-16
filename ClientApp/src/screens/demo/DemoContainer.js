import React from "react";
import AccordionsSegment from "../../sharedComponents/Accordions/AccordionsSegment"
import ModalPopupAlert from "../../sharedComponents/ModalPopup/ModalPopupAlert";
import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import MultiSelectList from "../../sharedComponents/MultiSelectList/MultiSelectList";
import GroupRadioButtons from "../../sharedComponents/GroupRadioButtons/GroupRadioButtons";
import TextboxField from "../../sharedComponents/TextboxField/TextboxField";
import PickDate from "../../sharedComponents/PickDate/PickDate";
import DateRangePicker from "../../sharedComponents/PickDateRange/PickDateRange";
import MultipleSelect from "../../sharedComponents/MultipleSelect/MultipleSelect";

const DemoContainer = (props) => {
    const handleSelected = (value) => {

    }

    const handleChange = (value) => {

    }    
    return (
        <React.Fragment>
            <div className="container" style={{padding: "100px"}}>
                <TextboxField lblName="Name: "/>
                <br/><br/><br/>
                <PickDate label="Date"/>
                <br/><br/>
                <br/>
                <DateRangePicker />
                <br/><br/><br/>
                <AccordionsSegment/>
                <br/><br/><br/>
                <Dropdown/>
                <br />
                <br/>
                <Dropdown id="myId" variant="standard" showLabel={true} lbldropdown="MyLabel" handleSelected={handleSelected} handleChange={handleChange} ddData={[
                {
                    "label": "NBA",
                    "value": "nba"
                },
                {
                    "label": "WNBA",
                    "value": "wnba"
                },
                {
                    "label": "NBA G League",
                    "value": "gleague"
                },
                {
                    "label": "Hall of Fame",
                    "value": "halloffame"
                },
                {
                    "label": "USAB",
                    "value": "usab"
                },
                {
                    "label": "NBA2K League",
                    "value": "2kleague"
                },
                {
                    "label": "Jr. NBA",
                    "value": "jrleague"
                },
                {
                    "label": "BAL",
                    "value": "bal"
                }
            ]} />
                <br/>
                <br/>
                {/* <ProgrammingScreen label="Programming"/> */}
                <br/><br/><br/>
                <MultipleSelect />
                <br />
                <MultiSelectList label="Multi Select List"/>
                <br/>
                <GroupRadioButtons label="Group Radio Button"/>
            </div>
        </React.Fragment>
    )
}

export default DemoContainer;