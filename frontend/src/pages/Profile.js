import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { Table, Button } from 'react-bootstrap';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    } else {
      console.error('User data not found in localStorage');
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
     <Navigation />
    <div>
      <h1>Profile Page</h1>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Address: {user.address}</p>
      <p>City: {user.city}</p>
      <p>Province: {user.province}</p>
      <p>Postcode: {user.postcode}</p>
      <p>Date of Birth: {new Date(user.date_of_birth).toLocaleDateString()}</p>
      <p>Gender: {user.gender}</p>
      <p>Status: {user.status}</p>
      {/* Render other user details as needed */}
    </div>
    </>
  );
};

export default ProfilePage;
