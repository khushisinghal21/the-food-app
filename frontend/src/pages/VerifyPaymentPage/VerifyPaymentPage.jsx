import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../cardContext/cardContext';

const VerifyPaymentPage = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [statusMsg, setStatusMsg] = useState('Verifying payment...');

  useEffect(() => {
    
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const success = params.get('success');
      const sessionId = params.get('session_id');
      const token = localStorage.getItem('authToken');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      if (!sessionId || !success) {
        setStatusMsg('Invalid payment verification request');
        navigate('/checkout', { replace: true });
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:8000/api/orders/confirm',
          { sessionId },
          { headers: authHeaders }
        );

        const resData = response?.data;
        if (resData?.success) {
          setStatusMsg('Payment verified successfully');
          clearCart();
          navigate('/myorders', { state: { order: resData.order } });
        } else {
          setStatusMsg('Payment verification failed');
          navigate('/checkout', { replace: true });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatusMsg('Payment verification failed');
        navigate('/checkout', { replace: true });
      }
    };

    verifyPayment();
  }, [location.search, navigate, clearCart]);

  return (
    <div>
      <h1>Verify Payment</h1>
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;
