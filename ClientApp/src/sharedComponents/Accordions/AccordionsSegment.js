import * as React from 'react';
import Typography from '@mui/material/Typography';
import AccordionSummary from './AccordionSummary';
import Accordion from './Accordion';
import AccordionDetails from './AccordionDetails';

const dummyData = require('../../static/dummyData.json');

export default function Accordions(props) {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  let AccordionData = props.data ? props.data : dummyData.accordion;
  return (
    
    <div>
        {
          AccordionData.map((ele, index) => {
            return (
              <Accordion key={index} expanded={expanded === ele.id} onChange={handleChange(`${ele.id}`)}>
                <AccordionSummary aria-controls="panel1d-content">
                  <Typography>{ele.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{ele.desc}</Typography>
                </AccordionDetails>
              </Accordion>
            )
          })
        }
    </div>
  );
}