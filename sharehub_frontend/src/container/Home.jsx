import React, { useState, useRef, useEffect } from 'react';

// components
import { Sidebar, UserProfile, Pins } from '../components';

// icons
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

// assets
import logo from '../assets/logo.png';

// sanity
import { client } from '../client';
import { userQuery } from '../utils/data';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);

  // check if there's user info from localstorage, then parse the data
  // otherwise clear the localStorage
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  useEffect(() => {
    // run the query function from data.js to get the user data based on the user sub (unique token)
    const query = userQuery(userInfo?.sub);

    // use the sanity client to fetch the result query
    client.fetch(query).then((data) => {
      // set the user state based on the first data of the array result
      setUser(data[0]);
    });
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar />
      </div>
      <div className="flex md:hidden flex-row">
        <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
        <Link to="/">
          <img src={logo} alt="logo" className="w-28" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img src={user?.image} alt="logo" className="w-28" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
