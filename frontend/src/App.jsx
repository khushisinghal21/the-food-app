
import './App.css';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home.jsx';
import ContactPage from './pages/ContactPage/ContactPage.jsx';
import Menu from './pages/Menu/Menu';
import AboutPage from './pages/AboutPage/AboutPage.jsx';
import Cart from './pages/Cart/Cart';
import SignUp from './components/SignUp/SignUp.jsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import VerifyPaymentPage from './pages/VerifyPaymentPage/VerifyPaymentPage.jsx'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.jsx';
import MyOrderPage from './pages/MyOrderPage/MyOrderPage.jsx';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutPage />} />
      
        <Route path='/menu' element={<Menu />} />
        <Route path='/login' element={<Home />}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/myOrder/verify' element={<VerifyPaymentPage/>}></Route>
        <Route path='/checkout' element={<PrivateRoute>< CheckoutPage/></PrivateRoute>     }></Route>
        <Route path='/cart' element={< PrivateRoute>
        <Cart/>
        
        </PrivateRoute>} />

        <Route path='/myorder' element={<PrivateRoute>
          <MyOrderPage/>

        </PrivateRoute>
       }></Route>
      </Routes>


    </div>
  );
}

export default App;
