import axios from 'axios';
import React from 'react';
import {
  FiArrowLeft,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiBox
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyOrder = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/orders',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { email: user?.email },
          }
        );

        console.log('RAW ORDERS FROM API:', response.data);

        const formattedOrders = (response.data || []).map((order, idx) => {
          // Use items if present, else fallback to item (singular)
          const itemsArr = order.items || order.item || [];
          return {
            ...order,
            items: (itemsArr).map((entry) => ({
              _id: entry._id,
              item: {
                ...entry.item
              },
              quantity: entry.quantity,
            })),
            createdAt: new Date(order.createdAt).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
            paymentStatus:
              order.paymentStatus?.toLowerCase() || 'pending',
          };
        });

        console.log('FORMATTED ORDERS:', formattedOrders);
        formattedOrders.forEach((order, idx) => {
          console.log(`Order[${idx}] final items:`, order.items);
        });

        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, user?.email]);

  // Early returns
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-300 text-xl">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">
          {error}{' '}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-amber-400 hover:text-amber-300"
          >
            Try Again
          </button>
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-300 text-xl">
          You have no orders yet.
        </p>
      </div>
    );
  }

  const statusStyles = {
    processing: {
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
      icon: FiClock,
      label: 'Processing',
    },
    outForDelivery: {
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      icon: FiTruck,
      label: 'Out for Delivery',
    },
    delivered: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: FiCheckCircle,
      label: 'Delivered',
    },
    succeeded: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: FiCheckCircle,
      label: 'Completed',
    },
  };

  const paymentMethods = {
    cod: {
      label: 'COD',
      class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50',
    },
    card: {
      label: 'Credit/Debit Card',
      class: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
    },
    upi: {
      label: 'UPI Payment',
      class: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    },
    default: {
      label: 'Online',
      class: 'bg-green-600/30 text-green-400 border-green-500/50',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3a2b1d] py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <FiArrowLeft />
            <span className="font-bold">Back to Home</span>
          </Link>
          <span className="text-amber-400/70 text-sm">
            {user?.email}
          </span>
        </div>

        <div className="bg-[#4b3b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20">
          <h2 className="text-3xl font-bold mb-6 text-center text-amber-400">
            Order History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3a2b2b]/50">
                <tr>
                  <th className="p-4 text-amber-400">Order ID</th>
                  <th className="p-4 text-amber-400">Customer</th>
                  <th className="p-4 text-amber-400">Phone</th>
                  <th className="p-4 text-amber-400">Items</th>
                  <th className="p-4 text-amber-400">Total Items</th>
                  <th className="p-4 text-amber-400">Price</th>
                  <th className="p-4 text-amber-400">
                    Payment Method
                  </th>
                  <th className="p-4 text-amber-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (sum, it) => sum + it.quantity,
                    0
                  );
                  const totalPrice =
                    order.total ??
                    order.items.reduce(
                      (sum, it) => sum + it.item.price * it.quantity,
                      0
                    );

                  const StatusIcon =
                    statusStyles[order.status]?.icon ||
                    FiClock;
                  const statusCfg =
                    statusStyles[order.status] ||
                    statusStyles.processing;

                  const paymentCfg =
                    paymentMethods[order.paymentMethod] ||
                    paymentMethods.default;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-[#3a2b2b]/30 hover:bg-[#3a2b2b]/20 transition-colors"
                    >
                      <td className="p-4 text-amber-100">
                        {order._id?.slice(-8)}
                      </td>
                      <td className="p-4 text-amber-100">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="p-4 text-amber-100">
                        {order.phone}
                      </td>
                      <td className="p-4">
                        {order.items.map((item, idx) => {
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-[#3a2b2b] rounded-lg mb-1"
                            >
                              <div className="flex-1">
                                <span className="text-amber-100/80 text-sm">
                                  {item.item.name}
                                </span>
                                <div className="flex items-center gap-2 text-amber-400/60 text-xs">
                                  <span>
                                    ₹{item.item.price.toFixed(2)}
                                  </span>
                                  <span className="mx-1">
                                    &dot;
                                  </span>
                                  <span>x{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-amber-400" />
                          <span className="text-amber-100 text-lg">
                            {totalItems}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-amber-300 text-lg">
                        ₹{totalPrice.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="px-3 py-1.5 rounded-lg border text-sm">
                          <span className={paymentCfg.class}>
                            {paymentCfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`${statusCfg.bg} ${statusCfg.color} px-3 py-1.5 rounded-lg border text-sm flex items-center gap-2`}
                        >
                          <StatusIcon />
                          <span>{statusCfg.label}</span>
                        </div>
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

export default MyOrder;
