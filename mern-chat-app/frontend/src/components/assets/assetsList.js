import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Box } from '@mui/system';
import { Button, Dialog, DialogActions, DialogContent, Fab, IconButton, MenuItem, Select, TableFooter, TextField, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import * as XLSX from 'xlsx/xlsx.mjs';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import background from '../../whatsapp.jpg';
import {
  Document,
  Packer,
  Paragraph,
  Table as docxTable,
  TableCell as docxTableCell,
  TableRow as docxTableRow,
  TextRun
} from "docx";
import { saveAs } from "file-saver";
import _ from 'lodash';
import useMediaQuery from '@mui/material/useMediaQuery';
import {AssetDesc} from './assetDesc';
import { BASE_URL } from '../url/url';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const AssetsList = ({ users, setDesc, setAssetFeatures }) => {
  const [data, setData] = React.useState([]);
  const [userAssets, setUserAssets] = React.useState({});
  const [detailedData, setDetailedData] = React.useState({});
  const [user, setUser] = React.useState('all');
  const [sort, setSort] = React.useState('select');
  const [sortbyAsset, setSortbyAsset] = React.useState('select');
  const [exported, setExported] = React.useState('select');
  const [filtered, setFiltered] = React.useState('');
  const [filterIndex, setFilterIndex] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState({
    laptopEdit: false,
    keyboardEdit: false,
    mouseEdit: false,
    headphoneEdit: false,
    dongleEdit: false
  });
  const [newAssets, setNewAssets] = React.useState({
    newKeyboard: '',
    newMouse: '',
    newHeadphone: '',
    newDongle: '',
    newLaptop: ''
  });
  const [updatedAssets, setUpdatedAssets] = React.useState({
    updatedKeyboard: '',
    updatedMouse: '',
    updatedHeadphone: '',
    updatedDongle: '',
    updatedLaptop: ''
  });
  const [oldAssets, setOldAssets] = React.useState({
    oldKeyboard: '',
    oldMouse: '',
    oldHeadphone: '',
    oldDongle: '',
    oldLaptop: ''
  });
  const [key, setKey] = React.useState(false);
  const [sortKey, setSortKey] = React.useState(false);
  const [add, setAdd] = React.useState(false);
  const [msg, setMsg] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openRemove, setOpenRemove] = React.useState(false);
  const [defined, setDefined] = React.useState(false);
  const [arryLength, setArrayLength] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [removeUserAssetsData, setRemoveUserAssetsData] = React.useState({});
  const [loadUserAssets, setLoadUserAssets] = React.useState(false);
  const [replaceKey, setReplaceKey] = React.useState('');
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width:700px)');


  React.useEffect(() => {
    axios.get(`${BASE_URL}/getassets`)
      .then((res) => {
        setData(res.data);
        setAdd(false);
        setDefined(true)
      })
      .catch(err => console.log(err))
  }, [msg,loadUserAssets]);

  const Laptop = data?.find(e => e.laptop[0])
  const Keyboard = data?.find(e => e.keyboard[0])
  const Mouse = data?.find(e => e.mouse[0])
  const Headphone = data?.find(e => e.headphone[0])
  const Dongle = data?.find(e => e.dongle[0])
  if (defined) {

    setDetailedData({
      laptop: Laptop.laptop,
      keyboard: Keyboard.keyboard,
      mouse: Mouse.mouse,
      headphone: Headphone.headphone,
      dongle: Dongle.dongle
    })
    setDefined(false);
    setArrayLength(true);
  }

  let initial = React.useRef(false)
  React.useMemo(() => {
    if (initial.current) {
      axios.get(`${BASE_URL}/getuserassets?username=${user}`)
        .then((res) => {
          console.log(res.data);
          setUserAssets(res.data);
          setLoadUserAssets(false)
        })
        .catch(err => {
          console.log(err);
          setUserAssets({})
        })
    } else initial.current = true;
  }, [user, loadUserAssets])

  const handleAddAssets = () => {
    axios({
      method: 'post',
      url: `${BASE_URL}/createassets`,
      data: {
        keyboard: newAssets.newKeyboard,
        mouse: newAssets.newMouse,
        headphone: newAssets.newHeadphone,
        dongle: newAssets.newDongle,
        laptop: newAssets.newLaptop
      }
    })
      .then((res) => {
        console.log(res);
        setMsg(!msg);
        setNewAssets({
          newKeyboard: '',
          newMouse: '',
          newHeadphone: '',
          newDongle: '',
          newLaptop: ''
        })

      })
      .catch(err => alert(err.response.data))
  }
  const handleClear = () => {
    setNewAssets({
      newKeyboard: '',
      newMouse: '',
      newHeadphone: '',
      newDongle: '',
      newLaptop: ''
    })
  }
  if (arryLength) {
    const maxLength = Math.max(detailedData.laptop?.length, detailedData.keyboard?.length, detailedData.mouse?.length, detailedData.headphone?.length, detailedData.dongle?.length)
    if (maxLength) {
      var actions = Array(maxLength).fill(0)
    }
  }

  const handleEdit = (i) => {
    const Laptop = data.find(e => e.laptop[i])
    const Keyboard = data.find(e => e.keyboard[i])
    const Mouse = data.find(e => e.mouse[i])
    const Headphone = data.find(e => e.headphone[i])
    const Dongle = data.find(e => e.dongle[i])
    setOldAssets({
      oldKeyboard: Keyboard.keyboard[i]?.model,
      oldMouse: Mouse.mouse[i]?.model,
      oldHeadphone: Headphone.headphone[i]?.model,
      oldDongle: Dongle.dongle[i]?.model,
      oldLaptop: Laptop.laptop[i]?.model
    })
    setIsEdit({
      laptopEdit: Laptop.laptop[i]?.assigned,
      keyboardEdit: Keyboard.keyboard[i]?.assigned,
      mouseEdit: Mouse.mouse[i]?.assigned,
      headphoneEdit: Headphone.headphone[i]?.assigned,
      dongleEdit: Dongle.dongle[i]?.assigned
    })
    setEditIndex(i);
    setToggle(!toggle)
  }
  const handleDone = (i) => {

    axios({
      method: 'put',
      url: `${BASE_URL}/updateassets`,
      data: {
        keyboard: updatedAssets.updatedKeyboard,
        mouse: updatedAssets.updatedMouse,
        headphone: updatedAssets.updatedHeadphone,
        dongle: updatedAssets.updatedDongle,
        laptop: updatedAssets.updatedLaptop,
        oldKeyboard: oldAssets.oldKeyboard,
        oldMouse: oldAssets.oldMouse,
        oldHeadphone: oldAssets.oldHeadphone,
        oldDongle: oldAssets.oldDongle,
        oldLaptop: oldAssets.oldLaptop
      }
    })
      .then((res) => {
        setMsg(!msg);
        setToggle(!toggle)
        setUpdatedAssets({
          updatedKeyboard: '',
          updatedMouse: '',
          updatedHeadphone: '',
          updatedDongle: '',
          updatedLaptop: ''
        })

      })
      .catch(err => alert(err.response.data))
  }
  const handleDelete = (i) => {
    const Laptop = data.find(e => e.laptop[i])
    const Keyboard = data.find(e => e.keyboard[i])
    const Mouse = data.find(e => e.mouse[i])
    const Headphone = data.find(e => e.headphone[i])
    const Dongle = data.find(e => e.dongle[i])
    setOldAssets({
      oldKeyboard: Keyboard.keyboard[i]?.model,
      oldMouse: Mouse.mouse[i]?.model,
      oldHeadphone: Headphone.headphone[i]?.model,
      oldDongle: Dongle.dongle[i]?.model,
      oldLaptop: Laptop.laptop[i]?.model
    })
    setOpen(true)
  }

  const handleRemove = () => {
    axios({
      method: 'put',
      url: `${BASE_URL}/removeassets`,
      data: {
        oldKeyboard: oldAssets.oldKeyboard,
        oldMouse: oldAssets.oldMouse,
        oldHeadphone: oldAssets.oldHeadphone,
        oldDongle: oldAssets.oldDongle,
        oldLaptop: oldAssets.oldLaptop
      }
    })
      .then((res) => {

        setOpen(false);
        setMsg(!msg);
      })
      .catch((err) => alert(err.response.data))
  }

  const handleFilter = (e) => {
    setFiltered(e.target.value);
    setKey(true);
  }

  let timer = React.useRef();

  if (key) {
    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      let index;
      (detailedData.laptop.find((e, i) => { if (e.model === filtered) index = i })
        || detailedData.keyboard.find((e, i) => { if (e.model === filtered) index = i })
        || detailedData.mouse.find((e, i) => { if (e.model === filtered) index = i })
        || detailedData.headphone.find((e, i) => { if (e.model === filtered) index = i })
        || detailedData.dongle.find((e, i) => { if (e.model === filtered) index = i }))
      setFilterIndex(index);
      if (index) {
        setDetailedData({
          laptop: detailedData.laptop.filter((e, i) => index === i),
          keyboard: detailedData.keyboard.filter((e, i) => index === i),
          mouse: detailedData.mouse.filter((e, i) => index === i),
          headphone: detailedData.headphone.filter((e, i) => index === i),
          dongle: detailedData.dongle.filter((e, i) => index === i),
        })
        setErrMsg(false)
      } else {

        setDetailedData({
          laptop: Laptop.laptop,
          keyboard: Keyboard.keyboard,
          mouse: Mouse.mouse,
          headphone: Headphone.headphone,
          dongle: Dongle.dongle
        })
        setErrMsg(true)
      }
      setKey(false)
    }, 2000)
  }

  const handleSortbyAsset = (e) => {
    setSortbyAsset(e.target.value);
    setSortKey(true)
  }

  if (sortKey) {
    if (sortbyAsset !== 'select') {
      let index = [];
      const prevAssets = _.cloneDeep(detailedData); // Use cloneDeep to create a deep copy of detailedData
      const sortedAsset = prevAssets[sortbyAsset]?.sort((a, b) => a.model.localeCompare(b.model));
      const keys = Object.keys(prevAssets);
      const dongleIndex = keys.indexOf(sortbyAsset);
      const remainingAssets = keys.splice(dongleIndex, 1);

      sortedAsset.map((e, i) => {
        detailedData[sortbyAsset].map((ele, ind) => {
          if (ele.model === e.model) {
            index.push(ind)
          }
        })
      })

      keys.forEach((element) => {
        prevAssets[element].forEach((e, i) => {
          prevAssets[element][i] = detailedData[element][index[i]]
        })
      })

      setDetailedData(prevAssets);

    } else {

      setDetailedData({
        laptop: Laptop.laptop,
        keyboard: Keyboard.keyboard,
        mouse: Mouse.mouse,
        headphone: Headphone.headphone,
        dongle: Dongle.dongle
      })

    }
    setSortKey(false);
  }

  const handleSort = (e) => {
    setSort(e.target.value);
    const prevAssets = _.cloneDeep(detailedData);
    if (e.target.value === 'asc') {
      setDetailedData({
        laptop: prevAssets.laptop.sort((a, b) => a.model.localeCompare(b.model)),
        keyboard: prevAssets.keyboard.sort((a, b) => a.model.localeCompare(b.model)),
        mouse: prevAssets.mouse.sort((a, b) => a.model.localeCompare(b.model)),
        headphone: prevAssets.headphone.sort((a, b) => a.model.localeCompare(b.model)),
        dongle: prevAssets.dongle.sort((a, b) => a.model.localeCompare(b.model))
      })

    }
    else if (e.target.value === 'desc') {
      setDetailedData({
        laptop: prevAssets.laptop.sort((a, b) => b.model.localeCompare(a.model)),
        keyboard: prevAssets.keyboard.sort((a, b) => b.model.localeCompare(a.model)),
        mouse: prevAssets.mouse.sort((a, b) => b.model.localeCompare(a.model)),
        headphone: prevAssets.headphone.sort((a, b) => b.model.localeCompare(a.model)),
        dongle: prevAssets.dongle.sort((a, b) => b.model.localeCompare(a.model))
      })
    }
    else {
      setDetailedData({
        laptop: Laptop.laptop,
        keyboard: Keyboard.keyboard,
        mouse: Mouse.mouse,
        headphone: Headphone.headphone,
        dongle: Dongle.dongle
      })
    }
  }

  const handleExported = (e) => {
    setExported(e.target.value);

    const headers = ['Keyboards', '', 'Mouses', '', 'Headphones', '', 'Dongles', '', 'Laptops', ''];

    const subHeaders = ['model', 'stock', 'model', 'stock', 'model', 'stock', 'model', 'stock', 'model', 'stock'];

    const rows = [];

    detailedData.keyboard.map((e, i) => {
      rows[i] = [e.model, e.assigned === false ? 'Available' : 'N/A']
    })
    detailedData.mouse.map((e, i) => {
      rows[i] = [...rows[i], e.model, e.assigned === false ? 'Available' : 'N/A']
    })
    detailedData.headphone.map((e, i) => {
      rows[i] = [...rows[i], e.model, e.assigned === false ? 'Available' : 'N/A']
    })
    detailedData.dongle.map((e, i) => {
      rows[i] = [...rows[i], e.model, e.assigned === false ? 'Available' : 'N/A']
    })
    detailedData.laptop.map((e, i) => {
      rows[i] = [...rows[i], e.model, e.assigned === false ? 'Available' : 'N/A']
    })

    if (e.target.value === 'csv') {

      var row = rows.map(e => e.join(','));
      var csv = [headers.join(","), subHeaders.join(","), ...row].join("\n");
      const link = document.createElement("a");
      link.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
      link.download = 'Assets List';
      link.click();

    } else if (e.target.value === 'excel') {

      const ws = XLSX.utils.aoa_to_sheet([headers, subHeaders, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const data2 = XLSX.write(wb, { type: 'base64' });
      const link = document.createElement('a');
      link.setAttribute('href', `data:application/vnd.ms-excel;base64,${data2}`);
      link.setAttribute('download', 'Assets List.xlsx');
      link.click();

    }
    else if (e.target.value === 'pdf') {

      const doc = new jsPDF();

      autoTable(doc, {
        head: [headers, subHeaders],
        body: rows


      });

      doc.save('Assets List.pdf')
    }
    else if (e.target.value === 'docx') {
      const tableRows = [headers, subHeaders, ...rows];

      const table = new docxTable({
        rows: tableRows.map((row) => {
          return new docxTableRow({
            children: row.map((cell) => {
              return new docxTableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell
                      })
                    ]
                  })
                ]
              });
            })
          });
        })
      });

      const doc = new Document({
        creator: "My App",
        title: "My Document",
        description: "Example document",
        sections: [
          {
            children: [table]
          }
        ]
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Assets List.docx");
      });
    }
  }

  const handleClick = () => {
    navigate('/assignassets')
  }

  const handleDesc = (asset,model) =>{
    setAssetFeatures({
      asset: asset,
      model: model
    })
    setDesc(true)
    navigate('/desc')
  }

  const handleReturnBack = (user,asset) =>{
    const keyValue = Object.keys(userAssets[0]).find(key => userAssets[0][key] === asset)
    setRemoveUserAssetsData({
      username: user,
      [keyValue]: asset
    });
    setOpenRemove(true)
  }

  const handleRemoveUserAssets = () =>{
    axios({
      method: 'put',
      url: `${BASE_URL}/removeuserassets`,
      data: removeUserAssetsData
    })
    .then((res)=>{
      console.log(res.data);
      setOpenRemove(false);
      setLoadUserAssets(true);
    })
    .catch(err=>alert(err.response.data))
  }
const handleReplaceChange = (user,asset) =>{
  const keyValue = Object.keys(userAssets[0]).find(key => userAssets[0][key] === replaceKey)
  
  if(asset !== replaceKey){
    axios({
      method: 'put',
      url: `${BASE_URL}/replaceuserassets`,
      data: {
        username : user,
        [keyValue]: asset,
        ['old'+keyValue.slice(0,1).toUpperCase()+keyValue.slice(1)]: replaceKey
      }
    })
    .then((res)=>{
      console.log(res.data);
      setLoadUserAssets(true);
      setReplaceKey('');
    })
    .catch(err=>alert(err.response.data))
  }
}

  return (
    <Box sx={{ backgroundImage: `url(${background})`, minHeight: '100vh', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mt: 2, color: 'white' }}>Select User</Typography>
          <Select
            sx={{ width: 150, backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
            value={user}
            onChange={(e) => setUser(e.target.value)}

          >
            <MenuItem value='all'>All</MenuItem>
            {
              users.map(ele => (
                <MenuItem key={ele.username} value={ele.username}>{ele.username}</MenuItem>
              ))
            }
          </Select>
        </Box>
        <Box sx={{ width: '150px' }}>
          <Typography sx={{ mt: 2, color: 'white' }}>Search</Typography>
          <TextField
            sx={{
              Input: {
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '50px',
              }
            }}
            placeholder='Search Here...'
            value={filtered}
            onChange={handleFilter}
            helperText={errMsg && filtered.length > 0 ? 'Asset Not Found' : ''}
          />

        </Box>
        <Box>
          <Typography sx={{ mt: 2, color: 'white' }}>Sort By Asset</Typography>
          <Select
            sx={{ width: 150, backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
            value={sortbyAsset}
            onChange={handleSortbyAsset}>
            <MenuItem value='select'>Select</MenuItem>
            <MenuItem value='keyboard'>keyboard</MenuItem>
            <MenuItem value='mouse'>mouse</MenuItem>
            <MenuItem value='headphone'>headphone</MenuItem>
            <MenuItem value='dongle'>dongle</MenuItem>
            <MenuItem value='laptop'>laptop</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography sx={{ mt: 2, color: 'white' }}>Sort</Typography>
          <Select
            sx={{ width: 150, backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
            value={sort}
            onChange={handleSort}>
            <MenuItem value='select'>Select</MenuItem>
            <MenuItem value='asc'>Ascending</MenuItem>
            <MenuItem value='desc'>Descending</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography sx={{ mt: 2, color: 'white' }} >Export</Typography>
          <Select
            sx={{ width: 150, backgroundColor: 'white', color: 'black', borderRadius: '50px' }}
            value={exported}
            onChange={handleExported}>
            <MenuItem value='select'>Select</MenuItem>
            <MenuItem value='csv'>csv</MenuItem>
            <MenuItem value='excel'>excel</MenuItem>
            <MenuItem value='pdf'>pdf</MenuItem>
            <MenuItem value='docx'>docx</MenuItem>
          </Select>
        </Box>
      </Box>
      {
        user &&
          user === 'all' ?
          <TableContainer component={Paper} sx={{ borderRadius: '20px' }}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Keyboards</StyledTableCell>
                  <StyledTableCell>Mouses</StyledTableCell>
                  <StyledTableCell>HeadPhones</StyledTableCell>
                  <StyledTableCell>Dongles</StyledTableCell>
                  <StyledTableCell>Laptops</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell>Model &nbsp; &nbsp; &nbsp; &nbsp; Stock</StyledTableCell>
                  <StyledTableCell>Model &nbsp; &nbsp; &nbsp; &nbsp; Stock</StyledTableCell>
                  <StyledTableCell>Model &nbsp; &nbsp; &nbsp; &nbsp; Stock</StyledTableCell>
                  <StyledTableCell>Model &nbsp; &nbsp; &nbsp; &nbsp; Stock</StyledTableCell>
                  <StyledTableCell>Model &nbsp; &nbsp; &nbsp; &nbsp; Stock</StyledTableCell>
                  <StyledTableCell>Edit &nbsp; &nbsp; &nbsp; &nbsp; Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <Box>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                >
                  <DialogContent>
                    <Typography>Do You Want To Remove The Assets?</Typography>
                  </DialogContent>
                  <DialogActions sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button onClick={handleRemove}>Yes</Button>&nbsp;
                    <Button onClick={() => setOpen(false)}>No</Button>
                  </DialogActions>
                </Dialog>
              </Box>
              <TableBody>

                {
                  <>
                    <StyledTableCell>
                      {detailedData &&
                        detailedData.keyboard?.map((ele, ind) => (

                          <StyledTableRow
                            sx={{ height: '50px', display: 'flex', alignItems: 'center' }}
                          >
                            {editIndex === ind && toggle && !ele.assigned ? (
                              <TextField
                                placeholder="Enter keyboard model"
                                defaultValue={ele.model}
                                onChange={(e) => setUpdatedAssets({ ...updatedAssets, updatedKeyboard: e.target.value })}
                              />
                            ) : (
                              <>
                                <Tooltip title={<AssetDesc model={ele.model} asset='Keyboard'/>} >
                                  <Typography
                                    sx={{cursor: 'pointer'}}
                                    onClick={()=>handleDesc('Keyboard',ele.model)}
                                    >{ele.model} </Typography>
                                </Tooltip> &nbsp; &nbsp; &nbsp; &nbsp;
                                {ele.assigned ? 'N/A' : 'Available'}
                              </>
                            )}
                          </StyledTableRow>
                        ))}
                    </StyledTableCell>

                    <StyledTableCell>
                      {detailedData &&
                        detailedData.mouse?.map((ele, ind) => (
                          <StyledTableRow
                            sx={{ height: '50px', display: 'flex', alignItems: 'center' }}
                          >
                            {editIndex === ind && toggle && !ele.assigned ? (
                              <TextField
                                placeholder="Enter mouse model"
                                defaultValue={ele.model}
                                onChange={(e) => setUpdatedAssets({ ...updatedAssets, updatedMouse: e.target.value })}
                              />
                            ) : (
                              <>
                                <Tooltip title={<AssetDesc model={ele.model} asset='Mouse'/>} >
                                  <Typography
                                    sx={{cursor: 'pointer'}}
                                    onClick={()=>handleDesc('Mouse',ele.model)}
                                    >{ele.model} </Typography>
                                </Tooltip> &nbsp; &nbsp; &nbsp; &nbsp;
                                {ele.assigned ? 'N/A' : 'Available'}
                              </>
                            )}
                          </StyledTableRow>
                        ))}
                    </StyledTableCell>

                    <StyledTableCell>
                      {detailedData &&
                        detailedData.headphone?.map((ele, ind) => (
                          <StyledTableRow
                            sx={{ height: '50px', display: 'flex', alignItems: 'center' }}
                          >
                            {editIndex === ind && toggle && !ele.assigned ? (
                              <TextField
                                placeholder="Enter headphone model"
                                defaultValue={ele.model}
                                onChange={(e) => setUpdatedAssets({ ...updatedAssets, updatedHeadphone: e.target.value })}
                              />
                            ) : (
                              <>
                                <Tooltip title={<AssetDesc model={ele.model} asset='Headphone'/>} >
                                  <Typography
                                    sx={{cursor: 'pointer'}}
                                    onClick={()=>handleDesc('Headphone',ele.model)}
                                    >{ele.model} </Typography>
                                </Tooltip> &nbsp; &nbsp; &nbsp; &nbsp;
                                {ele.assigned ? 'N/A' : 'Available'}
                              </>
                            )}
                          </StyledTableRow>
                        ))}
                    </StyledTableCell>

                    <StyledTableCell>
                      {detailedData &&
                        detailedData.dongle?.map((ele, ind) => (
                          <StyledTableRow
                            sx={{ height: '50px', display: 'flex', alignItems: 'center' }}
                          >
                            {editIndex === ind && toggle && !ele.assigned ? (
                              <TextField
                                placeholder="Enter dongle model"
                                defaultValue={ele.model}
                                onChange={(e) => setUpdatedAssets({ ...updatedAssets, updatedDongle: e.target.value })}
                              />
                            ) : (
                              <>
                                <Tooltip title={<AssetDesc model={ele.model} asset='Dongle'/>} >
                                  <Typography
                                    sx={{cursor: 'pointer'}}
                                    onClick={()=>handleDesc('Dongle',ele.model)}
                                    >{ele.model} </Typography>
                                </Tooltip> &nbsp; &nbsp; &nbsp; &nbsp;
                                {ele.assigned ? 'N/A' : 'Available'}
                              </>
                            )}
                          </StyledTableRow>
                        ))}
                    </StyledTableCell>

                    <StyledTableCell>
                      {detailedData &&
                        detailedData.laptop?.map((ele, ind) => (
                          <StyledTableRow
                            sx={{ height: '50px', display: 'flex', alignItems: 'center' }}
                          >
                            {editIndex === ind && toggle && !ele.assigned ? (
                              <TextField
                                placeholder="Enter laptop model"
                                defaultValue={ele.model}
                                onChange={(e) => setUpdatedAssets({ ...updatedAssets, updatedLaptop: e.target.value })}
                              />
                            ) : (
                              <>
                                <Tooltip title={<AssetDesc model={ele.model} asset='Laptop'/>} >
                                  <Typography
                                    sx={{cursor: 'pointer'}}
                                    onClick={()=>handleDesc('Laptop',ele.model)}
                                    >{ele.model} </Typography>
                                </Tooltip>
                                &nbsp; &nbsp; &nbsp; &nbsp;
                                {ele.assigned ? 'N/A' : 'Available'}
                              </>
                            )}
                          </StyledTableRow>
                        ))}

                    </StyledTableCell>
                  </>

                }
                <StyledTableCell>{actions && actions.map((e, i) => (
                  <StyledTableRow sx={{ height: '50px', display: 'flex' }}>
                    <IconButton
                      onClick={() => handleEdit(i)}
                    >
                      {editIndex === i && toggle && (!isEdit.laptopEdit
                        || !isEdit.keyboardEdit || !isEdit.mouseEdit
                        || !isEdit.headphoneEdit || !isEdit.dongleEdit)
                        ? <DoneIcon onClick={handleDone} /> : <EditIcon />}
                    </IconButton> &nbsp; &nbsp; &nbsp; &nbsp;
                    <IconButton
                      onClick={() => handleDelete(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableRow>
                ))}</StyledTableCell>
                {add &&
                  <StyledTableRow>
                    <StyledTableCell>
                      <TextField
                        placeholder='Enter keyboard model'
                        value={newAssets.newKeyboard}
                        onChange={(e) => setNewAssets({ ...newAssets, newKeyboard: e.target.value })}
                      /></StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        placeholder='Enter mouse model'
                        value={newAssets.newMouse}
                        onChange={(e) => setNewAssets({ ...newAssets, newMouse: e.target.value })}
                      /></StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        placeholder='Enter headphone model'
                        value={newAssets.newHeadphone}
                        onChange={(e) => setNewAssets({ ...newAssets, newHeadphone: e.target.value })}
                      /></StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        placeholder='Enter dongle model'
                        value={newAssets.newDongle}
                        onChange={(e) => setNewAssets({ ...newAssets, newDongle: e.target.value })}
                      /></StyledTableCell>
                    <StyledTableCell>
                      <TextField
                        placeholder='Enter laptop model'
                        value={newAssets.newLaptop}
                        onChange={(e) => setNewAssets({ ...newAssets, newLaptop: e.target.value })}
                      /></StyledTableCell>
                    <StyledTableCell>
                      <Button sx={{ height: '25px', mb: 0.5 }} variant='outlined' onClick={handleClear}>Cancel</Button>
                      <Button
                        sx={{ width: '91px', height: '25px' }}
                        variant='contained'
                        color='success'
                        onClick={handleAddAssets}>Save</Button>
                    </StyledTableCell>
                  </StyledTableRow>}

              </TableBody>
            </Table>
            <TableFooter sx={{ display: 'flex', justifyContent: 'end' }}>
              <Fab color="primary" aria-label="add" onClick={() => setAdd(!add)}>
                {add ? <CloseIcon /> : <AddIcon />}
              </Fab>
              <Button sx={{ ml: 2, borderRadius: '50px' }} variant='contained' onClick={handleClick}>Assign Assets</Button>
            </TableFooter>
          </TableContainer>
          :
          <Box >
            <TableContainer component={Paper} sx={{ borderRadius: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>User</StyledTableCell>
                    <StyledTableCell>Keyboard</StyledTableCell>
                    <StyledTableCell>Mouse</StyledTableCell>
                    <StyledTableCell>HeadPhone</StyledTableCell>
                    <StyledTableCell>Dongle</StyledTableCell>
                    <StyledTableCell>Laptop</StyledTableCell>
                  </TableRow>
                </TableHead>
                <Box>
                <Dialog
                  open={openRemove}
                  onClose={() => setOpenRemove(false)}
                >
                  <DialogContent>
                    <Typography>Do You Want To Remove The Assets?</Typography>
                  </DialogContent>
                  <DialogActions sx={{ display: 'flex', justifyContent: 'end' }}>
                    <Button onClick={handleRemoveUserAssets}>Yes</Button>&nbsp;
                    <Button onClick={() => setOpenRemove(false)}>No</Button>
                  </DialogActions>
                </Dialog>
              </Box>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell>{userAssets[0]?.username ? userAssets[0]?.username: 'N/A'}</StyledTableCell>
                    <StyledTableCell>{userAssets[0]?.keyboard ?
                    replaceKey === userAssets[0]?.keyboard? 
                    
                    <Select
                    defaultValue={userAssets[0]?.keyboard}
                    onChange={(e)=>handleReplaceChange(userAssets[0]?.username,e.target.value)}
                    >
                      <MenuItem value={userAssets[0]?.keyboard}>{userAssets[0]?.keyboard}</MenuItem>
                      {
                        detailedData.keyboard.filter(element=>element.model !== userAssets[0]?.keyboard )
                        .filter(elem=>elem.assigned === false)
                        .map((ele)=>(
                          <MenuItem value={ele.model}>{ele.model}</MenuItem>
                        ))
                      }
                      
                    </Select>
                    
                    :
                    <>
                    {userAssets[0]?.keyboard} &nbsp;
                    <Tooltip title='Replace'>
                      <IconButton onClick={()=>setReplaceKey(userAssets[0]?.keyboard)}>
                        <SyncAltIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      sx={{alignItems: 'center'}}
                      onClick={()=>handleReturnBack(userAssets[0]?.username,userAssets[0]?.keyboard)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </>  
                    : 'N/A'}</StyledTableCell>
                    <StyledTableCell>{userAssets[0]?.mouse ? 
                    replaceKey === userAssets[0]?.mouse ? 
                    
                    <Select
                    defaultValue={userAssets[0]?.mouse}
                    onChange={(e)=>handleReplaceChange(userAssets[0]?.username,e.target.value)}
                    >
                      <MenuItem value={userAssets[0]?.mouse}>{userAssets[0]?.mouse}</MenuItem>
                      {
                        detailedData.mouse.filter(element=>element.model !== userAssets[0]?.mouse )
                        .filter(elem=>elem.assigned === false)
                        .map((ele)=>(
                          <MenuItem value={ele.model}>{ele.model}</MenuItem>
                        ))
                      }
                    </Select>
                  
                    :
                    <>
                    {userAssets[0]?.mouse} &nbsp;
                    <Tooltip title='Replace'>
                      <IconButton onClick={()=>setReplaceKey(userAssets[0]?.mouse)}>
                        <SyncAltIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      sx={{alignItems: 'center'}}
                      onClick={()=>handleReturnBack(userAssets[0]?.username,userAssets[0]?.mouse)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </>  
                    : 'N/A'}</StyledTableCell>
                    <StyledTableCell>{userAssets[0]?.headphone ? 
                     replaceKey === userAssets[0]?.headphone? 
                    
                     <Select
                    defaultValue={userAssets[0]?.headphone}
                    onChange={(e)=>handleReplaceChange(userAssets[0]?.username,e.target.value)}
                    >
                      <MenuItem value={userAssets[0]?.headphone}>{userAssets[0]?.headphone}</MenuItem>
                      {
                        detailedData.headphone.filter(element=>element.model !== userAssets[0]?.headphone )
                        .filter(elem=>elem.assigned === false)
                        .map((ele)=>(
                          <MenuItem value={ele.model}>{ele.model}</MenuItem>
                        ))
                      }
                    </Select>
                   
                   :
                    <>
                    {userAssets[0]?.headphone} &nbsp;
                    <Tooltip title='Replace'>
                      <IconButton onClick={()=>setReplaceKey(userAssets[0]?.headphone)}>
                        <SyncAltIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      sx={{alignItems: 'center'}}
                      onClick={()=>handleReturnBack(userAssets[0]?.username,userAssets[0]?.headphone)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </>  
                    : 'N/A'}</StyledTableCell>
                    <StyledTableCell>{userAssets[0]?.dongle ?
                    replaceKey === userAssets[0]?.dongle? 
                    
                    <Select
                    defaultValue={userAssets[0]?.dongle}
                    onChange={(e)=>handleReplaceChange(userAssets[0]?.username,e.target.value)}
                    >
                      <MenuItem value={userAssets[0]?.dongle}>{userAssets[0]?.dongle}</MenuItem>
                      {
                        detailedData.dongle.filter(element=>element.model !== userAssets[0]?.dongle )
                        .filter(elem=>elem.assigned === false)
                        .map((ele)=>(
                          <MenuItem value={ele.model}>{ele.model}</MenuItem>
                        ))
                      }
                    </Select>
                  
                    :
                     <>
                     {userAssets[0]?.dongle} &nbsp;
                     <Tooltip title='Replace'>
                      <IconButton onClick={()=>setReplaceKey(userAssets[0]?.dongle)}>
                        <SyncAltIcon />
                      </IconButton>
                     </Tooltip>
                     <IconButton
                       sx={{alignItems: 'center'}}
                       onClick={()=>handleReturnBack(userAssets[0]?.username,userAssets[0]?.dongle)}
                     >
                       <DeleteIcon />
                     </IconButton>
                     </> 
                     : 'N/A'}</StyledTableCell>
                    <StyledTableCell>{userAssets[0]?.laptop ? 
                    replaceKey === userAssets[0]?.laptop? 
                    
                    <Select
                    defaultValue={userAssets[0]?.laptop}
                    onChange={(e)=>handleReplaceChange(userAssets[0]?.username,e.target.value)}
                    >
                      <MenuItem value={userAssets[0]?.laptop}>{userAssets[0]?.laptop}</MenuItem>
                      {
                        detailedData.laptop.filter(element=>element.model !== userAssets[0]?.laptop )
                        .filter(elem=>elem.assigned === false)
                        .map((ele)=>(
                          <MenuItem value={ele.model}>{ele.model}</MenuItem>
                        ))
                      }
                    </Select>
                  
                    :
                    <>
                    {userAssets[0]?.laptop} &nbsp;
                    <Tooltip title='Replace'>
                      <IconButton onClick={()=>setReplaceKey(userAssets[0]?.laptop)}>
                        <SyncAltIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      sx={{alignItems: 'center'}}
                      onClick={()=>handleReturnBack(userAssets[0]?.username,userAssets[0]?.laptop)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </> 
                    : 'N/A'}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
      }

    </Box>
  );
}

export default AssetsList;
