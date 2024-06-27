import React from 'react';


interface UserGreetingProps {
  handleLogout: () => void;
}

const Logout: React.FC<UserGreetingProps> = ({ handleLogout }) => (
    <button onClick={handleLogout} className="text-sm">
      로그아웃
    </button>
);

export default Logout;
