import React from 'react'
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiPhone,FiStar,FiBook,FiShoppingCart,FiKey,FiLogOut, FiPackage } from "react-icons/fi";
import { useCart } from '../../cardContext/cardContext';
import Login from '../Login/Login';

const Navbar = () => {
  const[isOpen, setIsOpen] = React.useState(false);
  const{ totalItems }=useCart()
const handleLoginSuccess = (loginData) => {
  localStorage.setItem('loginData', JSON.stringify({loggedIn: true, }));
  setIsAuthenticated(true);
  navigate('/'); // Redirect to home after login

}
   // Fixed: Changed 'href' to 'to' to match NavLink prop
   
   const location=useLocation()
   const [isAuthenticated, setIsAuthenticated] = React.useState(false);
   const[showLoginModal, setShowLoginModal] = React.useState(Boolean(localStorage.getItem('loginData')));
   const navigate=useNavigate()
const handleLogOut = () => {
  localStorage.removeItem('loginData');
  setIsAuthenticated(false);
  navigate('/'); // Redirect to home after logout
  setShowLoginModal(true); // Show login modal after logout

}
const navLinks=[
  {name: 'Home', to: '/', icon:<FiHome/>},
  {name: 'Contact', to: '/contact', icon:<FiBook/>},
  {name: 'Menu', to: '/menu', icon:<FiPhone/>},
  {name: 'About', to: '/about', icon:<FiStar/>},
  ...isAuthenticated ? [
    {name :'myOrders', to:'/myorder', icon:<FiPackage/> }
  ]:[]
 ];


const renderDeskstopAuthButton=()=>{
  return isAuthenticated? (
    <button onClick={handleLogOut} className='px-3 lg:px-4  py-1.5 md:py-2  lg:py-2 bg-gradient-to-br from-amber-600 to bg-amber-700 
 transform hover:scale-[1.02] border-2  border-amber-600/20 flex items-center space-x-2
 shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm 
 text-[#2D1B0E] rounded-2xl font-bold hover:shadow-amber-600/40 transition-all'>
      <FiLogOut className='text-base md:text-xl lg:text-xl' />
      <span className='text-shadow'>Logout</span>
    </button>
  ):(
    <button onClick={()=>{
      navigate('/login')

    }} className='px-3 lg:px-4  py-1.5   lg:py-2 bg-gradient-to-br from-amber-600 to bg-amber-700 
    transform hover:scale-[1.02] border-2  border-amber-600/20 flex items-center space-x-2
    shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm 
    text-[#2D1B0E] rounded-2xl font-bold hover:shadow-amber-600/40 transition-all'>
         <FiKey className='text-base  lg:text-xl' />
         <span className='text-shadow'>LogIn</span>
       </button>
  )
}


//extract mobile auth

const renderMobileAuthButton = () => {
  return isAuthenticated ? (
    <button onClick={handleLogOut} className='px-3 md:px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-amber-600 to bg-amber-700 
 text-[#2D1B0E] rounded-xl font-bold hover:shadow-lg hover:shadow:sh-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 flex items-center  justify-center space-x-2
 shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm '>
      <FiLogOut className='text-base md:text-xl lg:text-xl' />
      <span className='text-shadow'>Logout</span>
    </button>
  ) : (
    <button onClick={() => {
      navigate('/login')

      setIsOpen(false); // Close the menu when login button is clicked
    }} className='px-3 md:px-3 lg:px-6 py-1.5 md:py-2 lg:py-3 bg-gradient-to-br from-amber-600 to bg-amber-700 
    text-[#2D1B0E] rounded-2xl font-bold hover:shadow-lg hover:shadow:sh-amber-600/40 transition-all transform hover:scale-[1.02] border-2 border-amber-600/20 flex items-center space-x-2
    shadow-md shadow-amber-900/20 text-xs md:text-sm lg:text-sm '>
         <FiKey className='text-base md:text-xl lg:text-xl' />
         <span className='text-shadow'>Login</span> 
         </button>
  );

}
  React.useEffect(() => {
    setShowLoginModal(location.pathname === '/login');
    setIsAuthenticated(Boolean(localStorage.getItem('loginData')));
  }, [location.pathname]);

  
  return (
    <nav className='bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30
    sticky top-0 z-50 shadow-[0_25px_50px_-12px] front-vibes group/nav overflow-x-hidden'>
        <div className='absolute-top-3 eft-1/2 -translate-x-1/2 w-full max-w-7xl p-4 '>
        <div className='h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to
        transparent shadow-[0_0_20px] shadow-amber-500/30 '>
            <div className='flex-justify-between px-6'></div>
            <GiForkKnifeSpoon className='text-amber-500/40 -mt-4 -ml-2 rotate-45' size={32}/>
            <GiForkKnifeSpoon className='text-amber-500/40 -mt-4 -mr-2 rotate-45' size={32}/>
        </div>
        </div>
        <div className='max-w-7xl mx-auto px-4 relative'>
          <div className=' flex justify-between items-center h-16 md:h-20 lg:h-24'>
            <div className='  shrink-0 flex items-center space-x-2 group relative md:-translate-x-4 
             lg:-translate-x-6 ml-0 md:ml-2'>
              <div className='absolute inset-4 bg-amber-500/10 rounded-full blur-xl
              opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300'> </div>
             <GiChefToque className='text-xl md:text-4xl lg:text-5xl text-amber-500 
             transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_5px]
             hover:shadow-500 opacity-50'></GiChefToque>
             <div className='flex flex-col relative ml-2 max-w-[140px] md:max-w-160px lg:max-w-none'>
              <NavLink to='/' className='text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-amber-400
              to-amber-500 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-[0_2px_2px]
               drop-shadow-black -translate-x-2 truncate md:truncate-none  '>
                Foodie-Point
                </NavLink>
                <div className='h-[3px] bg-gradient-to-r from bg-amber-600/30 via amber-400/50 to amber-600/30 w-full mt-1 ml-1 shadow -[0_2px_5px] shadow-amber-500/20'></div>
             </div>
             </div>
             
              <div className=' hidden md:flex items-center space-x-4 md:space-x-4 lg:space-x-4 flex-1 justify-end'>
                {navLinks.map((link)=> (
                 <NavLink
                 key={link.name}
                 to={link.to}  // Now correctly using link.to
                 className={({ isActive }) =>
                   `group px-3 md:px-3 lg:px-4 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base relative 
                    transition-all duration-300 flex items-center hover:text-amber-900/20 rounded-3xl border-2
                    ${
                      isActive
                        ? 'border-amber-600/50 bg-amber-900/20 shadow-[inset_0_0_15px] shadow-amber-500/20'
                        : 'border-amber-900/30 hover:bg-amber-600/50'
                    } shadow-md shadow-amber-900/20`
                 }
               >
                 <span
                   className="mr-2 text-sm md:text-[15px] lg:text-base 
                              text-amber-500 group-hover:text-amber-300 transition-all"
                 >
                   {link.icon}
                 </span>
                 <span className="text-amber-100 group-hover:text-amber-300 relative">
                   {link.name}
                   <span
                     className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all
                                group-hover:w-full"
                   ></span>
                 </span>
               </NavLink>
                ))
                }
                <div className='flex item-center space-x-2 md:space-x-3 lg:space-x-4 ml-3
                md:ml-3 lg:ml-6 mr-2 md:mr-3 lg:mr-4'>
                  <NavLink to='/cart' className='p-2 md:p-2 lg:p-3 text-amber-100 rounded-xl transition-all 
                  relative border-2 border-amber-900/30 hover:bg-amber-600/50 group-hover:bg-amber-900/20 hover:shadow-lg hover:shadow-amber-500/30 shadow-md shadow-amber-900/20 
                  '>
                    <FiShoppingCart className='text-base  md:text-lg lg:text-lg '/>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </NavLink>

                  {renderDeskstopAuthButton()}
                </div>
              </div>

              <div className='md:hidden flex items-center mr-2'>
                <button className='to-amber-500 hover:text-amber-300 focus:outline-none
                transition-all p-2 rounded-xl border-amber-900/30 hover:border-amber-600/50
                relative shadow-md shadow-amber-900/20 hover:shadow-lg hover:shadow-amber-900/20' onClick={()=>{
                  setIsOpen(!isOpen)
                }}>
                  <div className='space-y-2 relative'>
                    <span className={`block w-6 h-[2px] bg-current transition-all  ${
                      isOpen ? 'rotate-45 translate-y-[7.5px]' : ''
                      
                      
                    }`}></span>

                    <span className={`block w-6 h-[2px] bg-current ${
                      isOpen ? 'opacity-0' : '}'
                    }`}></span>
                    <span className={`block w-6 h-[2px] bg-current transition-all  ${
                      isOpen ? '-rotate-45 translate-y-[-7.5px]'  : ''
                      
                      
                    }`}></span>
                  </div>
                </button>

              </div>
          </div>
        </div>

        {isOpen && (<div className='md:hidden bg-[#2D1B0E] border-t-4 border-amber-900/40 relative shadow-lg
        shadow-amber-900/30 w-full'>
          <div className='px-4 py-4 space-y-2 '>
          {navLinks.map((link) => (
  <NavLink 
    key={link.name} 
    to={link.to} 
    onClick={() => {
      setIsOpen(false); // Close the menu when a link is clicked
    }} 
    className={({ isActive }) =>
      ` px-4 py-3 text-sm rounded-xl transition-all items-center flex-block ${
        isActive
          ? 'bg-amber-600/30 text-amber-400'
          : 'text-amber-100 hover:bg-amber-600/20'
      } border-2 ${isActive ? 'border-amber-600/50' : 'border-amber-900/30'}`
    }
  >
    <span className="mr-2 text-sm text-amber-500">
      {link.icon}
    </span>
   {link.name}
    
  </NavLink>
))}
<div className='pt-4 border-amber-900/30 space-y-2'>
  <NavLink to='/cart' onClick={()=>{
    setIsOpen(false); // Close the menu when a link is clicked
  }} className='w-full px-4 py-3 text-center text-amber-100 rounded-xl border-amber-900/30 hover:border-amber-500/50 flex items-center justify-center space-x-2 text-sm'>
    <FiShoppingCart className='text-lg' />
    {totalItems > 0 && (
                      <span className=" top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
  </NavLink>
  {renderMobileAuthButton}
</div>

          </div>
        </div>

        )}

        {/*  login model*/}
        {showLoginModal && (
  <div className='fixed inset-0 bg-black/60 flex items-center justify-center z50 p-4'>
    <div className='bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-[480px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30'>
      <button onClick={() => {
        navigate('/');
        setShowLoginModal(false); // hide modal after closing
      }} className='absolute top-2 right-2 text-amber-500 hover:text-amber-300 text-2xl'>
        &times;
      </button>
      <h2 className='text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4 text-center'>
        Foodie-Point
      </h2>
      <Login
        onLoginSuccess={handleLoginSuccess}
        onClose={() => {
          navigate('/');
          setShowLoginModal(false);
        }}
      />
    </div>
  </div>
)}


    </nav>
  )
}

export default Navbar