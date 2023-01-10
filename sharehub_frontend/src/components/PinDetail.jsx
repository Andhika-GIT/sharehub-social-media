import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const fetchPinDetails = () => {
    // run query to search for spesific pin based on the pinId
    const query = pinDetailQuery(pinId);

    if (query) {
      client
        .fetch(query)
        // get that spesific single pin post and put into our state
        .then((data) => {
          setPinDetail(data[0]);

          // if we got that spesific single pin post
          if (data[0]) {
            // run another query to search for related posts pin
            // based on the same category as the current single pin post that we just got
            query = pinDetailMorePinQuery(data[0]);

            client
              .fetch(query)
              // get all related pin posts and put it into our state
              .then((res) => setPins(res));
          }
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="loading pin..." />;

  return (
    <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadious: '32px' }}>
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img src={pinDetail?.image && urlFor(pinDetail.image).url()} className="rounded-t-3xl rouded-b-lg" alt="user-post" />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a
              href={`${pinDetail.image?.asset?.url}?dl=`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              download
            >
              <MdDownloadForOffline />
            </a>
          </div>
          <a href={pinDetail.destination} target="_blank" rel="noreferrer">
            {pinDetail.destination}
          </a>
        </div>
        <div>
          <h1 className="text-4xl font-bold break-word mt-3">{pinDetail.title}</h1>
          <p className="mt-3">{pinDetail.about}</p>
        </div>
        <Link to={`user-profile/${pinDetail.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
          <img className="w-8 h-8 rounded-full object-cever" src={pinDetail.postedBy?.image} alt="user-profile" />
          <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
        </Link>
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-370 overflow-y-auto">
          {pinDetail?.comments?.map((comment, i) => (
            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
              <img src={comment.postedBy.image} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />
              <div className="flex flex-col">
                <p className="font-bold">{comment.postedBy.userName}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
