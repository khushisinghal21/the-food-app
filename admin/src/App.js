import React from 'react';
import Navbar from './components/Navbar';
import { Route , Routes} from 'react-router-dom';
import AddItems from './components/AddItems';
import List from './components/List';
import Order from './components/Order';
function App() {
  return (
    <>
    <Navbar/>
    <Routes>
    <Route path='/' element={<AddItems/>}></Route>
    <Route path='/list' element={<List/>}></Route>
    <Route path='/orders' element={<Order/>}></Route>
   </Routes>
    
    </>
   
  );
}

export default App;
