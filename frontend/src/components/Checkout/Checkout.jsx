// Helper to build image URL

import  { useEffect, useState } from 'react';
import { FaArrowAltCircleLeft, FaLock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../cardContext/cardContext';
import axios from 'axios';
const buildImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/100";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `http://localhost:8000${path}`;
  if (path.startsWith("uploads/")) return `http://localhost:8000/${path}`;
  return `http://localhost:8000/uploads/${path}`;
};


const Checkout = () => {

  const { totalAmount, cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod:''
  });
  const[loading,setLoading]=useState(false);

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const token= localStorage.getItem('authToken');
const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);   
    setError(null);
    // TODO: handle order submission
    console.log('Order submitted:', formData);
    const subtotal = Number(totalAmount).toFixed(2);
    const tax = (subtotal * 0.1).toFixed(2); // Assuming a 10% tax rate
    // Map payment method to backend enum
    let paymentMethod = formData.paymentMethod;
    if (paymentMethod === 'paypal') paymentMethod = 'online';
    // Build items array as per backend schema: { item: { name, imageUrl, price }, quantity }
    const items = cartItems.map(({ item, quantity }) => ({
      item: {
        name: item.name || 'Unknown Item',
        image: item.image || 'https://via.placeholder.com/100',
        price: item.price
      },
      quantity
    }));
    const total = (Number(subtotal) + Number(tax)).toFixed(2);
    // Enforce minimum order total on frontend (should match backend)
    const minOrderTotal = 50;
    if (Number(total) < minOrderTotal) {
      setError(`Minimum order amount is ₹${minOrderTotal}. Please add more items to your cart.`);
      setLoading(false);
      return;
    }
    const payload = {
      ...formData,
      paymentMethod,
      subtotal,
      tax,
      total,
      items
    };

    try {
      console.log('Selected payment method:', formData.paymentMethod);
      if (formData.paymentMethod === 'paypal' || formData.paymentMethod === 'online') {
        // Online payment
        const { data } = await axios.post('http://localhost:8000/api/orders', payload, { headers: authHeaders });
        console.log('Order placed (online):', data);
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setError('No payment gateway URL received from server.');
        }
      } else {
        // COD
        const { data } = await axios.post('http://localhost:8000/api/orders', payload, { headers: authHeaders });
        clearCart();
        navigate('/myorder', { state: { order: data.order } });
      }
    } catch (err) {
      console.log('order submission error:', err);
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };



  //payment gateway
  useEffect(()=>{
    const params=new URLSearchParams(location.search)
    const paymentStatus= params.get('payment_status');
    const sessionId = params.get('session_id');
    if(paymentStatus){
        setLoading(true);
        if(paymentStatus==='success' && sessionId){
            axios.post('http://localhost:8000/api/orders/confirm', {
               
                sessionId
            }, { headers: authHeaders })
            .then((response) => {
                console.log('Order confirmed:', response.data);
                clearCart();
                navigate('/myorders', { state: { order: response.data.order } });
            })
            .catch((error) => {
                console.error('Error confirming order:', error);
                setError('Failed to confirm order');
            })
            .finally(() => {
                setLoading(false);
            });
        }
        else if(paymentStatus === 'canceled') {
            setError('Payment failed/canceled. Please try again.');
            setLoading(false);

        }
    }
  }, [location.search, authHeaders, clearCart, navigate]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4'>
      <div className='mx-auto max-w-4xl'>
        <Link className='flex items-center gap-2 text-amber-400 mb-8' to='/cart'>
          <FaArrowAltCircleLeft /> Back to Cart
        </Link>
        <h1 className='text-4xl font-bold text-center mb-8'>Checkout</h1>
        <form className='grid lg:grid-cols-2 gap-12' onSubmit={handleSubmit}>
          <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>Personal Information</h2>
            <div className='space-y-4'>
              <div>
                <label className='block mb-1'>First Name</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='firstName' value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>Last Name</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='lastName' value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>Phone</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='phone' value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>Email</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='email' type='email' value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>Address</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='address' value={formData.address} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>City</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='city' value={formData.city} onChange={handleInputChange} required />
              </div>
              <div>
                <label className='block mb-1'>Zip Code</label>
                <input className='w-full px-4 py-2 rounded bg-[#2a1e1e] text-white' name='zipCode' value={formData.zipCode} onChange={handleInputChange} required />
              </div>
            </div>
          </div>
          {/* Payment Section */}
          <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
            <h2 className='text-2xl font-bold mb-4'>Payment Details</h2>
            
            <div className='space-y-4 mb-6'>
                <h3 className='text-lg font-semibold text-amber-100'>Your Order Items</h3>
                {cartItems.map(({_id, item, quantity}) => (
                  <div key={_id} className='flex justify-between items-center bg-[#3a2b2b] p-3 rounded-lg '>
                    <img
                      src={buildImageUrl(item.image || item.imageUrl)}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                    <div className='flex-1'>
                      <span className='text-amber-100'>{item.name}</span>
                      <span className='ml-2 text-amber-500/80 text-sm'> *{quantity}</span>
                    </div>
                    <span className='text-amber-300'>₹{(item.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              
            </div>
            <PaymentSummary totalAmount={totalAmount} />

            {/* Payment Method Selection */}

            <div>
                <label className='block mb-2'>Payment Method</label>
                <select name='paymentMethod' value={formData.paymentMethod} onChange={handleInputChange} required className='w-full px-4 py-3 rounded-xl bg-[#3a2b2b]'>
                    <option value=''>Select Payment Method</option>
                    <option value='cod'>COD</option>
                    <option value='online'>Online</option>
                </select>
            </div>
            {error && (
              <p className='text-red-400  mt-2'>
                {error}
              </p>
              
            )}
            <button type='submit' className='w-full bg-gradient-to-r from-red-600 to-amber-600 hover:bg-amber-400 py-4 rounded-xl font-bold flex justify-center items-center ' disabled={loading}>
                <FaLock className="mr-2 "/>{
                    loading ? 'Processing...' : 'Place Order'
                }
            </button>
          </div>
         
        </form>
      </div>
    </div>
  );
};

// If you want to use a reusable Input component, define it like this:
// const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
//   <div>
//     <label className='block mb-1'>{label}</label>
//     <input
//       className='w-full px-4 py-2 rounded-xl bg-[#3a2b2b]/50 '
//       name={name}
//       value={value}
//       onChange={onChange}
//       type={type}
//       required={required}
//     />
//   </div>
// );

const PaymentSummary = ({ totalAmount }) => {
  const subTotal = Number(totalAmount).toFixed(2);
  const tax = (subTotal * 0.1).toFixed(2); // Assuming a 10% tax rate
  const total = (Number(subTotal) + Number(tax)).toFixed(2); 
  
  return(
    <div className='space-y-2'>
        <div className=' flex justify-between'>
            <span
            >
                Subtotal:
            </span>
            <span>₹{subTotal}</span>

        </div>
        <div  className='flex justify-between'>
            <span>Tax (10%):</span>
            <span>₹{tax}</span>
        </div>
        <div className='flex justify-between font-bold border-t pt-2'>
            <span>Total:</span>
            <span>₹{total}</span>
        </div>

    </div>
  )
}

export default Checkout
