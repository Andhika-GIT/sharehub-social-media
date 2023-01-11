import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { userQuery } from '../utils/data';

// random image from unsplash
const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology,ai';

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

  const logoutHandler = () => {
    localStorage.clear();

    navigate('/login');
  };

  if (!user) {
    return <Spinner message="loading profile..." />;
  }
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}>
      <div className="relative pb-2 h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img className=" w-full h-370 2xl:h-510 shadow-lg object-cover" src={randomImage} alt="user-pic" />
              <img className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" src={user?.image} alt="user-pic" />
              <h1 className="fontold text-3xl texxt-center mt-3">{user?.userName}</h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {userId === user._id && (
                  <button type="button" className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md" onClick={logoutHandler}>
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserProfile;
