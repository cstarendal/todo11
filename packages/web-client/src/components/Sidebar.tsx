import React from 'react';

interface SidebarProps {
  activeList: string;
  onSelect: (list: string) => void;
}

const lists = [
  { id: 'today', label: 'Today' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'next7', label: 'Next 7 Days' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeList, onSelect }) => {
  return (
    <aside className="w-60 bg-gray-100 h-screen p-4 border-r border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Lists</h2>
      <ul className="space-y-1">
        {lists.map(list => (
          <li key={list.id}>
            <button
              onClick={() => onSelect(list.id)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-blue-100 ${
                activeList === list.id ? 'bg-blue-200 font-semibold' : ''
              }`}
            >
              {list.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar; 