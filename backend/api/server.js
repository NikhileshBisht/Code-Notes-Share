const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const dataFilePath = path.join(__dirname, '..', 'data.json');

  // Get request method and URL
  const method = req.method;
  const url = req.url;

  try {
    const data = await fs.promises.readFile(dataFilePath, 'utf-8');
    let currentData = JSON.parse(data);

    if (url === '/api/get-data' && method === 'POST') {
      // Handle /api/get-data
      const { name } = req.body;
      const matchedEntry = currentData.find(entry => entry.name.toString() === name.toString());
      
      if (!matchedEntry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json(matchedEntry);

    } else if (url === '/api/save-name' && method === 'POST') {
      // Handle /api/save-name
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const existingEntry = currentData.find(entry => entry.name === name);
      if (existingEntry) {
        return res.status(200).json({ message: 'Name already exists' });
      }

      currentData.push({ name, tabs: [] });
      await fs.promises.writeFile(dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Name saved successfully' });

    } else if (url === '/api/save-data' && method === 'POST') {
      // Handle /api/save-data
      const { name, tabs } = req.body;

      if (!name || !Array.isArray(tabs)) {
        return res.status(400).json({ error: 'Name and tabs are required' });
      }

      const updatedTabs = tabs.map((tab, index) => ({
        id: index + 1,
        name: tab.name || `untitled ${index + 1}`,
        content: tab.content || '',
      }));

      const existingEntry = currentData.find(entry => entry.name === name);
      if (existingEntry) {
        existingEntry.tabs = updatedTabs;
      } else {
        currentData.push({ name, tabs: updatedTabs });
      }

      await fs.promises.writeFile(dataFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
      res.status(200).json({ message: 'Data saved successfully' });

    } else {
      // 404 for any unmatched route or method
      res.status(404).json({ error: 'Route not found' });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Error reading data file' });
  }
};
