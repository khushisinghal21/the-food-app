// Helper to build image URL for local uploads
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  layoutClasses,
  tableClasses,
  paymentMethodDetails,
  statusStyles
} from './../assets/dummyData.jsx';
import { FiUser } from 'react-icons/fi';


const buildImageUrl = (img) => {
  if (!img) return 'https://via.placeholder.com/100';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads/')) return `http://localhost:8000${img}`;
  if (img.startsWith('uploads/')) return `http://localhost:8000/${img}`;
  return `http://localhost:8000/uploads/${img}`;
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/orders/getall', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const formatted = response.data.map(order => ({
          ...order,
          address: order.address ?? order.shippingAddress?.address ?? '',
          city: order.city ?? order.shippingAddress?.city ?? '',
          zipCode: order.zipCode ?? order.shippingAddress?.zipCode ?? '',
          phone: order.phone ?? '',
          items: order.items?.map(e => ({
            _id: e._id,
            item: e.item,
            quantity: e.quantity
          })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setOrders(formatted);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/api/orders/getall/${orderId}`, {
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setOrders(prevOrders =>
        prevOrders.map(o =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className={`${layoutClasses.page} flex items-center justify-center`}>
        <div className="text-amber-400 text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${layoutClasses.page} flex items-center justify-center`}>
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {['Order-ID', 'Customer', 'Address', 'Items', 'Total Items', 'Price', 'Payment', 'Status'].map(h => (
                    <th key={h} className={tableClasses.headerCell + (h === 'Total Items' ? ' text-center' : '')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
                  const totalPrice = order.total ?? order.items.reduce((s, i) => s + i.item.price * i.quantity, 0);
                  const payMethod = paymentMethodDetails[order.paymentMethod?.toLowerCase()] || paymentMethodDetails.default;
                  const payStatusStyle = statusStyles[order.paymentStatus] || statusStyles.processing;
                  const stat = statusStyles[order.status] || statusStyles.processing;

                  return (
                    <tr key={order._id} className={tableClasses.row}>
                      <td className={`${tableClasses.cellBase} font-mono text-sm text-amber-100`}>
                        #{order._id.slice(-8)}
                      </td>

                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <FiUser className="text-amber-400" />
                          <div>
                            <p className="text-amber-100">
                              {order.user?.name || `${order.firstName} ${order.lastName}`}
                            </p>
                            <p className="text-sm text-amber-400/60">{order.user?.phone || order.phone}</p>
                            <p className="text-sm text-amber-400/60">{order.user?.email || order.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Address Section */}
                      <td className={tableClasses.cellBase}>
                        <div className="text-amber-100/80 text-sm max-w-[200px]">
                          {order.address}, {order.city} - {order.zipCode}
                        </div>
                      </td>

                      {/* Items Section */}
                      <td className={tableClasses.cellBase}>
                        <div className="space-y-1 max-h-52 overflow-auto">
                          {order.items.map((itm, idx) => {
                            // console.log('Order item image fields:', itm.item.image, itm.item.imageUrl, itm.item);
                            return (
                              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg">
                                <div className="flex-1">
                                  <span className="text-amber-100/80 text-sm block truncate">
                                    {itm.item.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Items */}
                      <td className={`${tableClasses.cellBase} text-center text-amber-100`}>
                        {totalItems}
                      </td>

                      {/* Total Price */}
                      <td className={tableClasses.cellBase}>
                        ₹{totalPrice.toFixed(2)}
                      </td>

                      {/* Payment Method */}
                      <td className={tableClasses.cellBase}>
                        <span className={payStatusStyle}>{payMethod.label}</span>
                      </td>

                      {/* Order Status */}
                      <td className={tableClasses.cellBase}>
                        <select
                          className={`${stat} p-1 rounded-md bg-transparent`}
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                        >
                          {['processing', 'shipped', 'delivered'].map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
