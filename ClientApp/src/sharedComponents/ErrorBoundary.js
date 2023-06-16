import React from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import GenericMessageUI from './emptyStateUIContainers/GenericMessageUI';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        //... Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    content() {
        return <GenericMessageUI
            icon={<ErrorOutlineIcon />}
            title="Something went wrong"
            message="Please try again!" />;
    }
    render() {
        if (this.state.hasError) {
            //... You can render any custom fallback UI
            return this.content();
        }

        return this.props.children;
    }
}