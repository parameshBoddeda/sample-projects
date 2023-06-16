import * as React from 'react';
import AccordionSummary from './AccordionSummary';
import Accordion from './Accordion';
import AccordionDetails from './AccordionDetails';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@material-ui/core/styles';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { Checkbox } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  accordionSummary: {
    background: 'transparent !important',
    minHeight: 'unset !important',
    paddingLeft: theme.spacing(.5) + 'px !important',
    '& .MuiAccordionSummary-content': {
      margin: theme.spacing(1, 0),
    },
  },
  accordionDetails: {
    borderTop: 'none !important',
  },
  removePadding: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
  removeCompletePadding :{
    padding: '0px !important'
  },
  checkboxPadding: {padding: theme.spacing(.5) + 'px !important',},
  IconFont: { fontSize: '1rem !important' },
  manageFilterPosition: {position: "relative"},
  setPadding: {paddingLeft: theme.spacing(1)}
}));

const AccordionsContainer = (props) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);
  const [expanded, setExpanded] = React.useState(props.expand);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if(props.handleExpand){
      props.handleExpand(isExpanded ? panel : false);
    }
  };

  const handleCheckboxClick = (e) => {
    setChecked(e.target.checked);
    if(props.onCheckboxClick){
      props.onCheckboxClick(e)
    }
    setExpanded(props.panelName); 
    props.handleExpand(props.panelName);   
  }

  React.useEffect(()=>{
      setChecked(props.all);
  }, [props.all])

  React.useEffect(() => {
    setExpanded(props.expand);
  }, [props.expand])
  return (
    <div>
      <Accordion expanded={expanded} onChange={props.showExpandIcon !== false ? handleChange(props.panelName) : ""} className={props.setClassPosition ? classes.manageFilterPosition : ""}>
        <AccordionSummary
          expandIcon={props.showExpandIcon !== false ? expanded ? <CloseFullscreenIcon className={classes.IconFont} /> : <OpenInFullIcon className={classes.IconFont} /> : expanded}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={classes.accordionSummary}
        >
          {props.showCheckbox && <Checkbox checked={checked} onChange={handleCheckboxClick} size="small"className={classes.checkboxPadding}/>}
          <Typography className={!props.showCheckbox ? classes.setPadding : ''} variant='subtitle1' color="primary" fontWeight={500} sx={{ width: '33%', flexShrink: 0 }}>
            {props.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={`${classes.accordionDetails} ${props.removePadding ? classes.removeCompletePadding : (props.removeLRPadding ? classes.removePadding : "")}`}>
          {props.children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

AccordionsContainer.displayName = "AccordionsContainer";
export default AccordionsContainer;
