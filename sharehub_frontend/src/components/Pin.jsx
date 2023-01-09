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
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();

  // get the user data using from localstorage using fetchUser util
  const user = fetchUser();

  // check if the postedBy.id is equal to user sub (sub -> google unique id that we get from localstorage)
  // using length and !! to create logic that return true if the postedBy.id is equal to user.sub
  // because by default, filter only return array data not boolean

  // 1,[2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // 1,[2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)?.length;

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
              {alreadySaved ? <button>saved</button> : <button>save</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
