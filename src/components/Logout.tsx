import React from 'react';
import { IoIosLogOut } from "react-icons/io";

interface UserGreetingProps {
  handleLogout: () => void;
}

const Logout: React.FC<UserGreetingProps> = ({ handleLogout }) => (
    <button onClick={handleLogout} className="text-sm flex gap-1 items-center">
      로그아웃 <IoIosLogOut/>
    </button>
);

export default Logout;
