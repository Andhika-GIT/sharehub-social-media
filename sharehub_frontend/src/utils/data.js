export const userQuery = (userId) => {
  // get the data from user collection from sanity
  // where _type of collection is user, and the id is userId from parameter
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const searchQuery = (searchTerm) => {
  // get the posts from the user search, based on the title or category that matches the user search
  const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image {
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> {
      _id
      userName,
      image
    },
    save[] {
      _key,
      postedBy -> {
        _id,
        userName,
        image
      },
    },
  }`;

  return query;
};

export const feedQuery = `*[_type == 'pin'] | order(_createdAt desc) {
  image {
    asset -> {
      url
    }
  },
  _id,
  destination,
  postedBy -> {
    _id
    userName,
    image
  },
  save[] {
    _key,
    postedBy -> {
      _id,
      userName,
      image
    },
  },
}`;
