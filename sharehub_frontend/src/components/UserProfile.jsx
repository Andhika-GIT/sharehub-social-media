import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { userQuery } from '../utils/data';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    // run query to get user information based on the user id param
    const query = userQuery(userId);

    // fetch the user
    client.fetch(query).then((data) => {
      // put the result user into state
      setUser(data[0]);
    });
  }, [userId]);

  if (!user) {
    return <Spinner message="loading profile..." />;
  }
  return <div>UserProfile</div>;
};

export default UserProfile;
