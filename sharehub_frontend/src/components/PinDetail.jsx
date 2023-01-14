import React, { useState, useEffect, useRef } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const commentInputRef = useRef();
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPinDetails = () => {
      // run query to search for spesific pin based on the pinId
      let query = pinDetailQuery(pinId);

      if (query) {
        client
          .fetch(query)
          // get that spesific single pin post and put into our state
          .then((data) => {
            console.log(data[0]);
            setPinDetail(data[0]);
            setComments(data[0].comments);
            // if we got that spesific single pin post
            if (data[0]) {
              // run another query to search for related posts pin
              // based on the same category as the current single pin post that we just got
              query = pinDetailMorePinQuery(data[0]);

              client
                .fetch(query)
                // get all related pin posts and put it into our state
                .then((res) => {
                  setPins(res);
                  console.log(comments);
                });
            }
          });
      }
    };
    fetchPinDetails();

    // console.log(pinDetail);
  }, [pinId]);

  // method for handling add comment
  const addComment = () => {
    const comment = commentInputRef.current.value;
    // if we already have a comment
    if (comment) {
      // set addingComment state to true
      setAddingComment(true);

      client
        // add comment based on the pinId param
        .patch(pinId)
        // if we don't have any comment, then set the comment into empty array
        .setIfMissing({ comments: [] })
        // insert the comment
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then((data) => {
          // run the fetchPinDetails again
          // fetchPinDetails();
          // reset the comment
          setComments((prev) => [
            ...prev,
            {
              comment,
              postedBy: {
                image: user.image,
                userName: user.userName,
                _id: user._id,
              },
            },
          ]);
          setAddingComment(false);

          console.log(comments);
        });
    }
  };

  if (!pinDetail) {
    return <Spinner message="Showing pin" />;
  }

  return (
    <>
      {pinDetail && (
        <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadious: '32px' }}>
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
            <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
              <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {comments?.map((comment, i) => (
                <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                  <Link to={`/user-profile/${comment.postedBy?._id}`}>
                    <img src={comment.postedBy?.image} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />
                  </Link>
                  <div className="flex flex-col">
                    <p className="font-bold">{comment.postedBy?.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user?._id}`}>
                <img className="w-10 h-10 rounded-full cursor-pointer" src={user?.image} alt="user-profile" />
              </Link>
              <input disabled={addingComment} className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300" type="text" placeholder="Add a comment" ref={commentInputRef} />
              <button type="button" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none" onClick={addComment}>
                {addingComment ? 'posting...' : 'post'}
              </button>
            </div>
          </div>
        </div>
      )}
      {pins?.length > 0 && <h2 className="text-center font-bold text-2xl mt-8 mb-4">More like this</h2>}
      {pins ? <MasonryLayout pins={pins} /> : <Spinner message="Loading more pins" />}
    </>
  );
};

export default PinDetail;
