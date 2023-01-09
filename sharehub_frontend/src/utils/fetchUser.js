export const fetchUser = () => {
  // check if there's user info from localstorage, then parse the data
  // otherwise clear the localStorage
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  return userInfo;
};
