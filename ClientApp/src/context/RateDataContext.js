//Global Imports Start
import React, { useState, useEffect } from "react";

//Global Imports End
//Regional Imports Start
import { GetRateCardData } from "../services/rate.service";
import {RateCardSampleData} from "../static/RateCardData"
//Regional Imports End
export const RateDataContext = React.createContext({

});

export const RateDataProvider = (props) => {
    const [RateData, setRateData] = useState([]);

    // const getRateData = () => {
    //     GetRateCardData().then(data => {
    //         if (data) {
    //             setRateData(data);
    //         }
    //         else console.log("getRateData API is failing");
    //     })
    // }

    // useEffect(() => {
    //     getRateData();
    // }, []);


    const providerValue = {
        // RateData,
        // getRateData: () => {
        //     console.log("callback received in rate data context")
        //     getRateData()
        // }
    };

    return (
        <RateDataContext.Provider value={providerValue}>
            {props.children}
        </RateDataContext.Provider>
    );
};

export const RateDataConsumer = RateDataContext.Consumer;

export default RateDataContext;
