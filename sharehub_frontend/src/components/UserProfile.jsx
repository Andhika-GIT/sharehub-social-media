import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";

// random image from unsplash
const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology,ai";

// dynamic styles
const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  // useEffect for fetching user data
  useEffect(() => {
    // run query to get user information based on the user id param
    const query = userQuery(userId);

    // fetch the user
    client.fetch(query).then((data) => {
      // put the result user into state
      setUser(data[0]);
    });
  }, [userId]);

  // useEffect to display created or saved pin based on the text state
  useEffect(() => {
    // if the text state is 'created'
    if (text === "Created") {
      // get all pins that created by the current user id that logged in
      const createdPinsQuery = userCreatedPinsQuery(userId);

      // pass the query into client sanity to get all created pins
      client.fetch(createdPinsQuery).then((data) => {
        // insert the result created pins into pins state
        setPins(data);
      });
    } else {
      // else, get all pins that saved by the current user id that logged in
      const savedPinsQuery = userSavedPinsQuery(userId);

      // pass the query into client sanity to get all created pins
      client.fetch(savedPinsQuery).then((data) => {
        // insert the result created pins into pins state
        setPins(data);
      });
    }
  }, [text, userId]);

  const logoutHandler = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) {
    return <Spinner message="loading profile..." />;
  }
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
    >
      <div className="relative pb-2 h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
                src={randomImage}
                alt="user-pic"
              />
              <img
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                src={user?.image}
                alt="user-pic"
                referrerPolicy="no-referrer"
              />
              <h1 className="fontold text-3xl texxt-center mt-3">
                {user?.userName}
              </h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {userId === user._id && (
                  <button
                    type="button"
                    className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md flex gap-2 items-center"
                    onClick={logoutHandler}
                  >
                    <p className="text-sm text-red-500">Logout</p>
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mb-7">
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("created");
                }}
                className={`${
                  activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("saved");
                }}
                className={`${
                  activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Saved
              </button>
            </div>
            {pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No Pins Found!
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserProfile;
