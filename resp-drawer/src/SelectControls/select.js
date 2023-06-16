import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText } from '@mui/material';

export default function BasicSelect({ selectFields, setSelectFields, setKey }) {

  const handleChange = (key, value) => {
    let fields = {
      ...selectFields,
      [key]: value
    }
    setSelectFields(fields)
    setKey(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', flexDirection: 'row' }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_SSShooterId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.wsId}
              onChange={(e) => handleChange('wsId', e.target.value)}
              displayEmpty
            >
              <MenuItem value={''} disabled>Select</MenuItem>
              <MenuItem value={71}>71</MenuItem>
              <MenuItem value={72}>72</MenuItem>
              <MenuItem value={73}>73</MenuItem>
              <MenuItem value={74}>74</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={76}>76</MenuItem>
              <MenuItem value={77}>77</MenuItem>
              <MenuItem value={78}>78</MenuItem>
              <MenuItem value={79}>79</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_SSShooter</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.ws}
              onChange={(e) => handleChange('ws', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={1}>XS-TT</MenuItem>
              <MenuItem value={2}>S-TT</MenuItem>
              <MenuItem value={3}>M-TT</MenuItem>
              <MenuItem value={4}>L-TT</MenuItem>
              <MenuItem value={5}>XL-TT</MenuItem>
              <MenuItem value={6}>XXL-TT</MenuItem>
              <MenuItem value={7}>XXXL-TT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_JacketId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.wjId}
              onChange={(e) => handleChange('wjId', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={71}>71</MenuItem>
              <MenuItem value={72}>72</MenuItem>
              <MenuItem value={73}>73</MenuItem>
              <MenuItem value={74}>74</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={76}>76</MenuItem>
              <MenuItem value={77}>77</MenuItem>
              <MenuItem value={78}>78</MenuItem>
              <MenuItem value={79}>79</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_Jacket</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.wj}
              onChange={(e) => handleChange('wj', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={1}>XS-TT</MenuItem>
              <MenuItem value={2}>S-TT</MenuItem>
              <MenuItem value={3}>M-TT</MenuItem>
              <MenuItem value={4}>L-TT</MenuItem>
              <MenuItem value={5}>XL-TT</MenuItem>
              <MenuItem value={6}>XXL-TT</MenuItem>
              <MenuItem value={7}>XXXL-TT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_PantId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.wpId}
              onChange={(e) => handleChange('wpId', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={71}>71</MenuItem>
              <MenuItem value={72}>72</MenuItem>
              <MenuItem value={73}>73</MenuItem>
              <MenuItem value={74}>74</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={76}>76</MenuItem>
              <MenuItem value={77}>77</MenuItem>
              <MenuItem value={78}>78</MenuItem>
              <MenuItem value={79}>79</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">WarmUps_Pant</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.wp}
              onChange={(e) => handleChange('wp', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={1}>XS-TT</MenuItem>
              <MenuItem value={2}>S-TT</MenuItem>
              <MenuItem value={3}>M-TT</MenuItem>
              <MenuItem value={4}>L-TT</MenuItem>
              <MenuItem value={5}>XL-TT</MenuItem>
              <MenuItem value={6}>XXL-TT</MenuItem>
              <MenuItem value={7}>XXXL-TT</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', flexDirection: 'row' }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Practice_SweatshirtId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.psId}
              onChange={(e) => handleChange('psId', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={71}>71</MenuItem>
              <MenuItem value={72}>72</MenuItem>
              <MenuItem value={73}>73</MenuItem>
              <MenuItem value={74}>74</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={76}>76</MenuItem>
              <MenuItem value={77}>77</MenuItem>
              <MenuItem value={78}>78</MenuItem>
              <MenuItem value={79}>79</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Practice_Sweatshirt</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.ps}
              onChange={(e) => handleChange('ps', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={1}>XS-TT</MenuItem>
              <MenuItem value={2}>S-TT</MenuItem>
              <MenuItem value={3}>M-TT</MenuItem>
              <MenuItem value={4}>L-TT</MenuItem>
              <MenuItem value={5}>XL-TT</MenuItem>
              <MenuItem value={6}>XXL-TT</MenuItem>
              <MenuItem value={7}>XXXL-TT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Compression_TopId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.ctId}
              onChange={(e) => handleChange('ctId', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={71}>71</MenuItem>
              <MenuItem value={72}>72</MenuItem>
              <MenuItem value={73}>73</MenuItem>
              <MenuItem value={74}>74</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={76}>76</MenuItem>
              <MenuItem value={77}>77</MenuItem>
              <MenuItem value={78}>78</MenuItem>
              <MenuItem value={79}>79</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Compression_Top</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.ct}
              onChange={(e) => handleChange('ct', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={1}>XS-TT</MenuItem>
              <MenuItem value={2}>S-TT</MenuItem>
              <MenuItem value={3}>M-TT</MenuItem>
              <MenuItem value={4}>L-TT</MenuItem>
              <MenuItem value={5}>XL-TT</MenuItem>
              <MenuItem value={6}>XXL-TT</MenuItem>
              <MenuItem value={7}>XXXL-TT</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Footware_ShoeSizeId</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.fsId}
              onChange={(e) => handleChange('fsId', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={141}>141</MenuItem>
              <MenuItem value={142}>142</MenuItem>
              <MenuItem value={143}>143</MenuItem>
              <MenuItem value={144}>144</MenuItem>
              <MenuItem value={145}>145</MenuItem>
              <MenuItem value={146}>146</MenuItem>
              <MenuItem value={147}>147</MenuItem>
              <MenuItem value={148}>148</MenuItem>
              <MenuItem value={149}>149</MenuItem>
              <MenuItem value={150}>150</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl >
            <FormHelperText id="demo-simple-select-label">Footware_ShoeSize</FormHelperText>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectFields.fs}
              onChange={(e) => handleChange('fs', e.target.value)}
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>

  );
}