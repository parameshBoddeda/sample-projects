import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { FormLabel } from '@mui/material';
import Paper from '@mui/material/Paper';
const dummyData = require('../../static/dummyData.json')

const MultiSelectList = (props) => {
  const [checked, setChecked] = React.useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    if(props.handleChecked){
      props.handleChecked(newChecked)
    }
  };

  const customList = (items, label) => (
      <React.Fragment>
        <FormLabel style={{fontWeight: "bolder"}}>{label ? label : "Label"}</FormLabel>
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>      
            <List dense component="div" role="list">
                {items.map((value) => {
                const labelId = `${value}`;
                return (
                    <ListItem
                    key={value}
                    role="listitem"
                    button
                    onClick={handleToggle(value)}
                    >
                    <ListItemIcon>
                        <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value}`} />
                    </ListItem>
                );
                })}
                <ListItem />
            </List>
        </Paper>
    </React.Fragment>
  );

  let items = dummyData.multiSelectList;
  return (
    <Grid container spacing={2}>
      <Grid item>{customList(items, props.label)}</Grid>
    </Grid>
  );
}

MultiSelectList.displayName = "MultiSelectListComponent";
export default MultiSelectList;