import React from "react";
import tableau from 'tableau-api';

let viz;

class ViewReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
        this.updateURL = this.updateURL.bind(this);
    }

    componentDidMount() {
        this.updateURL();
        this.showReport();
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.url !== previousState.url) {
            this.setState({ url: this.props.url }, this.showReport);
        }
    }

    updateURL() {
        this.setState({ url: this.props.url }, this.showReport);
    }

    showReport() {
        var dvReport = document.getElementById('rptContainer');
        var options = {
            width: '100%',
            height: '550px'
        };
        var url = this.props.url;
        if (viz) {
            viz.dispose();
        }
        viz = new window.tableau.Viz(dvReport, url, options);
    }

    render() {
        return (<div id="rptContainer">
        </div>);
    }
}

export default ViewReport;