import React from 'react';

interface User {
  username: string;
}

interface UserGreetingProps {
  user: User;
  handleLogout: () => void;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ user, handleLogout }) => (
  <div className="flex items-center justify-between w-full max-w-2xl p-4 mb-4">
    <p><strong className='text-green-600'>{user.username}</strong>님</p>
    <button onClick={handleLogout} className="text-sm">
      로그아웃
    </button>
  </div>
);

export default UserGreeting;
