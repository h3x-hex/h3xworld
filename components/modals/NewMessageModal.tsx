'use client';

import { FC } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

type User = {
  name: string;
  username: string;
};

type NewMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const users: User[] = [
  { name: 'Lena Brooks', username: 'lenabrooks' },
  { name: 'Carlos Diaz', username: 'carlos.dz' },
  { name: 'Fatima Khan', username: 'fatimak' },
  { name: 'Leo Zhang', username: 'leo_zh' },
  { name: 'Maya Patel', username: 'mayapatel_' },
  { name: 'Jonas Berg', username: 'jonasb' },
  { name: 'Sara Müller', username: 'saramuller' },
  { name: 'Ali Reza', username: 'ali.rezaa' },
  { name: 'Nina Park', username: 'ninaparkkk' },
  { name: 'Omar Said', username: 'omarsaid' },
];

const NewMessageModal: FC<NewMessageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 pt-20 px-4">
      <div className="w-full max-w-md bg-black text-white rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center px-4 py-3 border-b border-gray-700">
          <button onClick={onClose} className="p-1 mr-3">
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
          <h2 className="text-lg font-semibold">New message</h2>
        </div>
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="To: Search"
            className="w-full px-3 py-2 mb-4 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none"
          />
          <p className="text-sm text-gray-400 mb-2">Suggested</p>
          <ul className="divide-y divide-gray-800">
            {users.map((user, idx) => (
              <li key={idx} className="py-2 flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-gray-500">@{user.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
