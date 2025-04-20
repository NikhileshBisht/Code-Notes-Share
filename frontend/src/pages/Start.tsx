import { useState } from 'react';
import Notes from './Notes';
import "../App.css";

const Start = () => {
  const [name, setName] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        console.log('Data saved successfully');
        setIsEdit(true);
      } else {
        console.error('Error saving data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <>
      {isEdit ? (
        <Notes data={name} />
      ) : (
        <div className='container'>
          <div className='full-container'>
            <div className="brutalist-container">
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="CREATE ROOM"
                className="brutalist-input smooth-type"
              />
              <label className="brutalist-label">Code.Notes</label>
            </div>
            <div className="button-borders">
              <button className="primary-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Start;
