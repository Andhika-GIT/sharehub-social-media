import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

// create unique id
import { v4 as uuidv4 } from 'uuid';

// icons
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

// sanity client
import { client, urlFor } from '../client';

// util
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  // when users hover their mouse into one of the pin image post
  const [postHovered, setPostHovered] = useState(false);

  const navigate = useNavigate();

  // get the user data using from localstorage using fetchUser util
  const user = fetchUser();

  // check if the postedBy.id is equal to user sub (sub -> google unique id that we get from localstorage)
  // using length and !! to create logic that return true if the postedBy.id is equal to user.sub
  // because by default, filter only return array data not boolean

  // 1,[2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // 1,[2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)?.length;

  // method when user clicked the save button
  const savePin = (id) => {
    // check if alreadySaved is not true
    // which means the user haven't saved the post yet
    if (!alreadySaved) {
      client
        // update the save collection document schema based on the receiving id
        .patch(id)
        // if id is missing, set the save document to null array
        .setIfMissing({ save: [] })
        // insert the data into save document schema
        // save[-1] -> insert the data at the end
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(), // generate unique id
            userId: user.sub,
            postedBy: {
              // also insert into postedBy document schema
              _type: 'postedBy',
              // refrence to user.sub (user unique google id)
              _ref: user.sub,
            },
          },
        ])
        // when we insert data don't using sanity, we have to commit
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  // method when user clicked the delete pin button
  const deletePin = (id) => {
    client
      // delete the pin based on the id
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img className="rounded-lg w-full" alt="user-post" src={urlFor(image).width(250).url()} />
        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{ height: '100%' }}>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  download
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none">
                  {save?.length} saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a href={destination} target="_blank" rel="noreferrer" className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md">
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user.sub && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100  font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`user-profile/${user?._id}`} className="flex gap-2 mt-2 items-center">
        <img className="w-8 h-8 rounded-full object-cever" src={postedBy?.image} alt="user-profile" />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
