import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  // exit the component if we didn't receive user props
  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 px-3 md:px-0">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline outline-1 focus-within:shadow-sm focus-border-2">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => {
            navigate("/search");
            setSearchTerm(e.target.value);
          }}
          placeholder="search"
          value={searchTerm ? searchTerm : ""}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-3 items-center">
        <Link
          to={`user-profile/${user?._id}`}
          className="hidden md:flex items-center w-full h-12"
        >
          <img
            src={user.image}
            alt="user"
            className="w-full rounded-lg"
            referrerPolicy="no-referrer"
          />
        </Link>
        <Link
          to="create-pin"
          className="text-black bg-slate-300 hover:text-white hover:bg-gray-800 rounded-lg w-full h-10 md:rounded-lg md:h-12 flex justify-center items-center gap-1  py-2 px-4"
        >
          <p className="text-md">Add</p>
          <p className="text-md">Image</p>
          <IoMdAdd className="hidden md:block" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
