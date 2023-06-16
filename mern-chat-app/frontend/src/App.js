import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/register/register';
import Chat from './components/home/chat';
import { createContext, useState } from 'react';
import AssetsList from './components/assets/assetsList';
import AssignAssets from './components/assets/assignAssets';
import DataTable from './components/dataTable/dataTable';
import { AssetDesc } from './components/assets/assetDesc';
import DragAndDrop from './components/dragAndDrop/dargAndDrop';

export const  MyContext = createContext();

function App() {
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const [desc , setDesc] = useState(false);
  const [assetFeatures, setAssetFeatures] = useState({
    asset: '',
    model: ''
  })
  
  return (
    <BrowserRouter >
    <MyContext.Provider value={{data,setData}}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chat users={users} setUsers={setUsers}/>} />
        <Route path='/assetslist' element={<AssetsList  users={users} setDesc={setDesc} setAssetFeatures={setAssetFeatures}/>} />
        <Route path='/assignassets' element={<AssignAssets users={users} />} />
        <Route path='/datatable' element={<DataTable />} />
        <Route path='/desc' element={<AssetDesc desc={desc} assetFeatures={assetFeatures} />} />
        <Route path='/draganddrop' element={<DragAndDrop />} />
      </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
