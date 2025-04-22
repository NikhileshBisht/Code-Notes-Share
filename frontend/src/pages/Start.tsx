import { useState } from 'react';
import Notes from './Notes';
import "../App.css";
import { ClimbingBoxLoader } from 'react-spinners';


const Start = () => {
  const [name, setName] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = async (): Promise<void> => {
    setLoading(true); 
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
    }finally {
      setLoading(false);  
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <ClimbingBoxLoader color="#33d4bb" loading={loading} size={15} />
        </div>
      ) : isEdit ? (
        <Notes data={name} />
      ) : (
        <div className='container'>
          <div className='full-container'>
            <div className="brutalist-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
