import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../Api-config/auth.api";

const Head = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    setUserEmail(email);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const userName = userEmail ? userEmail.split("@")[0] : "";
  const firstLetter = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    const token = sessionStorage.getItem("token");
    try {
      await signOut(token);
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="grid grid-flow-col p-4 mb-1 shadow-md sticky top-0 bg-white z-50">
      <div className="flex col-span-1 items-center">
        <h2 className="text-xl font-bold">SkillsEval ~ Portal</h2>
      </div>

      <div className="col-span-1 flex items-center justify-end relative">
        <div className="relative" ref={dropdownRef}>
          <div
            className="h-8 w-8 flex items-center justify-center rounded-full cursor-pointer bg-red-400"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <p className="text-white text-sm">{firstLetter}</p>
          </div>
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white border border-gray-300 rounded-md shadow-md py-2 px-4 w-60 z-20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md font-bold">{userName}</p>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
                <p
                  className="text-red-600 hover:text-red-800 font-bold text-sm cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Head;
