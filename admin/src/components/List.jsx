// Helper to build image URL for local uploads
import React, { useState, useEffect } from 'react';
import { styles } from './../assets/dummyData.jsx';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';


const buildImageUrl = (img) => {
  if (!img) return 'https://via.placeholder.com/100';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads/')) return `https://the-food-app-backend.onrender.com${img}`;
  if (img.startsWith('uploads/')) return `https://the-food-app-backend.onrender.com/${img}`;
  return `https://the-food-app-backend.onrender.com/uploads/${img}`;
};

const List = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get('https://the-food-app-backend.onrender.com/api/items');
        // Support both {success, data: [...]} and legacy [...]
        if (data && Array.isArray(data.data)) {
          setItems(data.data);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.log('Error in fetching items', e);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, []);

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`https://the-food-app-backend.onrender.com/api/items/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      console.log('Deleted item ID:', itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };
  

  const renderStar = (rating) => {
    return (
      [...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`text-xl ${i < rating ? 'text-amber-400 fill-current' : 'text-amber-100/30'}`}
        />
      ))
    );
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper.replace(/bg-gradient-to-br.*/, '').concat(' flex items-center justify-center text-amber-100')}>
        Loading Menu...
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="max-w-7xl mx-auto">
        <div className={styles.cardContainer}>
          <h2 className={styles.title}>Manage Menu Items</h2>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th className={styles.th}>Image</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Price (₹)</th>
                  <th className={styles.th}>Rating</th>
                  <th className={styles.th}>Hearts</th>
                  <th className={styles.thCenter}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} className={styles.tr}>
                    <td className={styles.imgCell}>
                      <img
                        src={buildImageUrl(item.image || item.imageUrl)}
                        alt={item.name}
                        className={styles.img}
                        style={{
                          width: '64px',
                          height: '64px',
                          maxWidth: '100%',
                          maxHeight: '15vw',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          aspectRatio: '1/1',
                        }}
                        sizes="(max-width: 600px) 48px, 64px"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }}
                      />
                    </td>
                    <td className={styles.nameCell}>
                      <div className="space-y-1">
                        <p className={styles.nameText}>{item.name}</p>
                        <p className={styles.descText}>{item.description}</p>
                      </div>
                    </td>
                    <td className={styles.categoryCell}>{item.category}</td>
                    <td className={styles.priceCell}>₹{item.price}</td>
                    <td className=  {styles.ratingCell}>
                      <div className='flex gap-1'>
                      {renderStar(item.rating)}
                        </div></td>
                    <td className={styles.heartsCell}>{item.hearts}</td>
                    <td className={styles.thCenter}>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default List;
