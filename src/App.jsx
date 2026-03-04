import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [walks, setWalks] = useState(() => {
    const saved = localStorage.getItem('tracker_walks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tracker_walks', JSON.stringify(walks));
  }, [walks]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const getMonthlyTotal = (userName) => {
    return walks
      .filter(w => w.user === userName)
      .filter(w => {
        const d = new Date(w.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, w) => sum + parseFloat(w.distance), 0);
  };

  const risinduTotal = getMonthlyTotal('Risindu');
  const isuruTotal = getMonthlyTotal('Isuru');
  const goalComplete = risinduTotal >= 30 && isuruTotal >= 20;

  const handleUpload = (e) => {
    e.preventDefault();
    const distance = e.target.distance.value;
    const file = e.target.photo.files[0];
    
    if (!distance || !file) return alert("Please add both a distance and a photo!");

    const reader = new FileReader();
    reader.onloadend = () => {
      const newWalk = {
        id: Date.now(),
        user: activeUser,
        date: new Date().toISOString(),
        distance: parseFloat(distance),
        image: reader.result 
      };
      setWalks([...walks, newWalk]);
      e.target.reset();
      alert("Walk saved successfully!");
    };
    reader.readAsDataURL(file);
  };

  if (!activeUser) {
    return (
      <div className="container">
        <h1>Walking Tracker 🏃‍♂️</h1>
        <h2 className="text-center">Who is tracking today?</h2>
        <div className="button-group">
          <button onClick={() => setActiveUser('Risindu')}>Risindu</button>
          <button onClick={() => setActiveUser('Isuru')}>Isuru</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {goalComplete && <div className="banner">🏆 Monthly Goal Complete! 🏆</div>}
      
      <header>
        <h1>{activeUser}'s Dashboard</h1>
        <button className="back-btn" onClick={() => setActiveUser(null)}>Switch User</button>
      </header>

      <div className="stats-card">
        <h3>This Month's Progress</h3>
        <p><strong>Risindu:</strong> {risinduTotal} / 30 km</p>
        <p><strong>Isuru:</strong> {isuruTotal} / 20 km</p>
      </div>

      <div className="upload-section">
        <h3>Upload Today's Walk</h3>
        <form onSubmit={handleUpload}>
          <label>Distance Walked (km):</label>
          <input type="number" step="0.1" name="distance" placeholder="e.g. 5.2" required />
          
          <label>Walk Photo:</label>
          <input type="file" accept="image/*" name="photo" required />
          
          <button type="submit">Save Walk</button>
        </form>
      </div>

      <div className="history">
        <h3>Your Recent Walks</h3>
        <div className="walk-grid">
          {walks.filter(w => w.user === activeUser).map(walk => (
            <div key={walk.id} className="walk-card">
              <img src={walk.image} alt="Walk view" />
              <p><strong>{walk.distance} km</strong></p>
              <p className="date-text">{new Date(walk.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;