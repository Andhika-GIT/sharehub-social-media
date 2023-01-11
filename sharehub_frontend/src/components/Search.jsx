import React, { useState, useEffect } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // begin the loading

    if (searchTerm) {
      // search for spesific pins that matches the searchTerm
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query).then((data) => {
        setPins(data); // insert data into pins state
        setLoading(false); // stop loading
      });
    } else {
      // if there's not searchTerm then simply fetch all the pins
      client.fetch(feedQuery).then((data) => {
        setPins(data); // insert data into pins state
        setLoading(false); // stop loading
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="searching for pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && <div className="mt-10 text-center text-xl">No Pins Found!</div>}
    </div>
  );
};

export default Search;
