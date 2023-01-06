export const userQuery = (userId) => {
  // get the data from user collection from sanity
  // where _type of collection is user, and the id is userId from parameter
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};
