import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


const SelectControl = () => {
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rank</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Rank"
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SelectControl;