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

  return <div>PinDetail</div>;
};

export default PinDetail;
