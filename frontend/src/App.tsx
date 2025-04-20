import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import Notes from './pages/Notes';
// import CreatePage from './CreatePage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Start />} />
        {/* <Route path="/connect" element={<ConnectPage />} />
        <Route path="/create" element={<CreatePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
