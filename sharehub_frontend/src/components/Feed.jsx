import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';

// components
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  // get the category based on the url
  const { categoryId } = useParams();

  // useEffect to fetch posts based on spesific category
  useEffect(() => {
    // set the loading to true
    setLoading(true);

    // if the user searching posts for spesific category
    if (categoryId) {
      const query = searchQuery(categoryId);

      // fetch data based on the query
      client.fetch(query).then((data) => {
        // set the pins state data
        setPins(data);
        setLoading(false);
      });
    } else {
      // if user didn't search psots for spesific category

      // fetch all posts
      client.fetch(feedQuery).then((data) => {
        // set the pins state data
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner message="we are adding new ideas to your feed!" />;

  if (!pins?.length) return <h2>No pins available</h2>;

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
