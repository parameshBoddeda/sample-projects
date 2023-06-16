import * as React from 'react';
import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton,  FormControl} from '@mui/material';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
const SearchComponent = (props) => {

  const [searched, setSearched] = React.useState('');
 
  const searchObj = (obj, query, parentObj) => {
    let listObj = [];
    for (var key in obj) {
      if(obj[key] && (props.restrictedFields && !props.restrictedFields.includes(key))) {
        var value = obj[key];
        if (typeof value === 'object' && value !== null) {
          parentObj = obj;
          let found = searchObj(value, query, obj);
            if (found) 
                listObj.push(obj);
            
        } else if (value) {
            if (value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
                obj.isFound = true;
                return obj;
            } else {
                obj.isFound = false;
            }            
        }
      }
    }

    if(listObj.length > 0) return listObj;
  }

  const handleCustomFilter = (searchRegex) => {
    let data = JSON.parse(JSON.stringify(props.originalData));
    var searchFilter = data.filter(function (obj) {
      return searchObj(obj, searchRegex, null);
    });
    props.setFilterData(searchFilter, true);
  }

  const requestSearch = (e) => {
    performSearch(e.target.value);
  }

  const performSearch = (searchedVal) => {
    if(props.ignoreFilter){
      props.setFilterData(searchedVal);
    }

    setSearched(searchedVal);
    if(props.setSearchItem){
      props.setSearchItem(searchedVal);
    }

    if (searchedVal === undefined) {
        props.setFilterData(props.originalData, false);
        return false;
    }

    searchedVal = searchedVal.trim();
    if (searchedVal.length < 3) {
        props.setFilterData(props.originalData, false);
        return false;
    }

    let searchRegex = new RegExp(escapeRegExp(searchedVal.trim()), 'i');
    if(props.enableCustomFilter) {
      handleCustomFilter(searchedVal.trim());
    } else {
      let filteredRows = props.originalData.filter((row) => {
        return Object.keys(row).some((field) => {
          if (props.restrictedFields) {
            if (row[field] && (!props.restrictedFields.includes(field))) {
              return searchRegex.test(row[field].toString());
              }
            } else {
            if (row[field]) {
              return searchRegex.test(row[field].toString());
              }
            } 
          });
        });
      props.setFilterData(filteredRows);
    } 
  };

  React.useEffect(()=>{
    if(props.applyLocalFilter){
      if(!searched){
        props.resetApplyLocalFilter();
      } else {
        if(props.searchItem && props.searchItem !== searched){
          performSearch(props.searchItem);          
        } else
         performSearch(searched);
      }      
    }

    if(props.searchItem && props.searchItem !== searched){
      performSearch(props.searchItem);
    }
    
  },[props.applyLocalFilter])

  return (
    <FormControl sx={{ width: '22ch' }} size='small' variant="outlined">
      <OutlinedInput
        value={searched} placeholder="Enter 3 characters"
        onChange={requestSearch}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={requestSearch} title="Enter 3 characters to Search"
              edge="end"
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

SearchComponent.displayName = "SearchComponent";
export default SearchComponent;