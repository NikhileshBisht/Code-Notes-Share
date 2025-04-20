import React from 'react';
import './DeletePopup.css';

type DeletePopupProps = {
  onConfirm: () => void;
  onCancel: () => void;
  name: string;
};

const DeletePopup: React.FC<DeletePopupProps> = ({ onConfirm, onCancel, name }) => {
  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <h3 className="black">Delete Confirmation</h3>
        <p className="black">
          Are you sure you want to delete <strong>{name}</strong>?
        </p>
        <div className="popup-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
