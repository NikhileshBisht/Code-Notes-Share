import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';
import DeletePopup from './DeletePopup';

const SheetTabs = (prop: any) => {
  const [tabs, setTabs] = useState([{ id: 1, name: 'untitled 1', content: '' }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-data`);
        const data = await response.json();
        const matchedEntry = data.find(entry => entry.name === prop?.data);

        if (matchedEntry) {
          setTabs(matchedEntry.tabs);
          setActiveTabId(matchedEntry.tabs[0]?.id || 1);
        } else {
          const initialTab = { id: 1, name: 'untitled 1', content: '' };
          setTabs([initialTab]);
          setActiveTabId(1);

          // Save this new entry to backend immediately
          saveDataToBackend({ tabs: [initialTab] });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [prop?.data]);



  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const saveDataToBackend = useCallback(
    debounce(async (data) => {
      try {
        const filteredData = {
          name: prop?.data,
          tabs: data.tabs.filter(tab => tab.name.trim() !== '' || tab.content.trim() !== '')
        };

        console.log('Sending data:', filteredData); // Log the data being sent

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filteredData),
        });

        if (response.ok) {
          console.log('Data saved successfully');
        } else {
          const errorData = await response.json();
          console.error('Error saving data:', errorData.error);
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error saving data:', error);
        alert('An unexpected error occurred');
      }
    }, 500),
    [prop?.data]
  );



  const addTab = () => {
    const newId = tabs.length ? Math.max(...tabs.map(t => t.id)) + 1 : 1;
    const newTab = {
      id: newId,
      name: `untitled ${newId}`,
      content: ''
    };
    const newTabs = [...tabs, newTab];
    setTabs(newTabs);
    setActiveTabId(newId);
    saveDataToBackend({ tabs: newTabs });
  };

  const removeTab = (id) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
    setIsDelete(false);
    setSelectedTab(null);
    saveDataToBackend({ tabs: newTabs });
  };

  const handleDoubleClick = (tab) => {
    setEditingId(tab.id);
    setInputValue(tab.name);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      const newTabs = tabs.map(tab =>
        tab.id === editingId ? { ...tab, name: inputValue.trim() } : tab
      );
      setTabs(newTabs);
      saveDataToBackend({ tabs: newTabs });
    }
    setEditingId(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputBlur();
    }
  };

  const handleTextareaChange = (e) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, content: e.target.value } : tab
    );
    setTabs(updatedTabs);
    saveDataToBackend({ tabs: updatedTabs });
  };

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <>
      {isDelete && selectedTab && (
        <DeletePopup
          name={selectedTab.name}
          onConfirm={() => removeTab(selectedTab.id)}
          onCancel={() => {
            setIsDelete(false);
            setSelectedTab(null);
          }}
        />
      )}
      <div className="sheet-tabs-wrapper">
        <div className="sheet-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`sheet-tab ${tab.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
              onDoubleClick={() => handleDoubleClick(tab)}
            >
              {editingId === tab.id ? (
                <input
                  className="tab-input"
                  value={inputValue}
                  autoFocus
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                />
              ) : (
                <>
                  <span>{tab.name}</span>
                  {tabs.length > 1 && (
                    <button
                      className="close-tab"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (tab.content.trim() !== '') {
                          setSelectedTab(tab);
                          setIsDelete(true);
                        } else {
                          removeTab(tab.id);
                        }
                      }}
                    >
                      ✕
                    </button>

                  )}
                </>
              )}
            </div>
          ))}
          <button className="add-tab" onClick={addTab}>＋</button>
        </div>
        <div style={{
          position: 'absolute',
          left: 'calc(100% - 55px)',
          top: '10%'
        }}>
          <button
            className="copy-button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(activeTab?.content || '');
              }
            }}
            title="Copy text"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            📋
          </button>
        </div>

        <textarea
          style={{
            height: 'calc(100vh - 112px)',
            fontSize: '14px',
            margin: '12px',
            width: 'calc(100% - 24px)',
            resize: 'none',
            background: "grey",
          }}
          value={activeTab?.content || ''}
          onChange={handleTextareaChange}
        />
      </div>
    </>
  );
};

export default SheetTabs;
