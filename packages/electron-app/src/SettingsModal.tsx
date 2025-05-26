import * as React from 'react';

type SettingsModalProps = {
  open: boolean;
  storagePath: string;
  onChooseFolder: () => void;
  onClose: () => void;
};

const SettingsModal = ({ open, storagePath, onChooseFolder, onClose }: SettingsModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[400px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <div className="font-medium mb-1">Storage Folder</div>
          <span data-testid="storage-path" className="block text-gray-600 mb-2">{storagePath || '/not/selected'}</span>
          <button
            data-testid="choose-folder"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onChooseFolder}
          >
            Change Folder
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 