import * as React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const DrawerComponent = (props) => {

    return (
        <>
            <SwipeableDrawer variant={props.variant??"persistent"}
                anchor={props.anchor ? props.anchor : "bottom"}
                open={props.open}
                BackdropProps={{ invisible: true }}
                onClose={props.handleDrawerClose}
                onOpen={props.handleDrawerOpen}
                className={props.className ? props.className : ''}
            >
                {props.children}
            </SwipeableDrawer>
        </>
    );
}

DrawerComponent.displayName = "DrawerComponent";
export default DrawerComponent;