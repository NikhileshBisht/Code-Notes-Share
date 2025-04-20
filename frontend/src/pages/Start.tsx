  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Notes from './Notes';
  import "../App.css"


  const Start = () => {
      const [name, setName] = useState('');
      const [isEdit, setIsEdit] = useState(false);
      const navigate = useNavigate();

      const handleSubmit = async () => {
          // Send the input value to the backend
          
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-name`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
          });
        
          if (response.ok) {
            console.log('Data saved successfully');
          } else {
            console.error('Error saving data');
          }
          console.log(`isedit`,isEdit)
          setIsEdit(true);
        };
        
        


      return (
          <>
              {isEdit ?
                  <Notes data={name} />
                  :
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
                              <button className="primary-button" onClick={handleSubmit}> Submit
                              </button>
                          </div>
                      </div>
                  </div>}
          </>
      );
  };

  export default Start;
