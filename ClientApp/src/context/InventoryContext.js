//////Global Imports Start
////import React, { useState, useEffect } from "react";

////import { GetInventory, GetInventoryUnit } from "../services/inventory.service";


////export const InventoryDataContext = React.createContext({

////});

////export const InventoryDataProvider = (props) => {
////    const [Inventory, setInventory] = useState([]);

////    const getInventory = (leagueId) => {
////        GetInventory(leagueId).then(data => {
////            if (data) {
////                setInventory(data);
////            }
////            else console.log("GetInventory API is failing");
////        })
////    }

////    useEffect(() => {
////        getInventory();
////    }, []);


////    const providerValue = {
////        Inventory: Inventory,
////        getInventory: () => { 
////            console.log("callback received in context")
////            getInventory() }
////    };

////    return (
////        <InventoryDataContext.Provider value={providerValue}>
////            {props.children}
////        </InventoryDataContext.Provider>
////    );
////};

////export const InventoryDataConsumer = InventoryDataContext.Consumer;

////export default InventoryDataContext;
