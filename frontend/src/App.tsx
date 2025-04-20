import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
// import Notes from './pages/Notes'; // Remove if unused

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
      </Routes>
    </Router>
  );
}

export default App;
