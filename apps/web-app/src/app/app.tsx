// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
}

interface ApiResponse {
  result: {
    data: User;
  };
}

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3003/api/getUserById?input=0');
        const data: ApiResponse = await response.json();
        setUser(data.result.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Create new user function
  const createUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3003/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          age: 25,
          isActive: true
        })
      });
      const data: ApiResponse = await response.json();
      setUser(data.result.data);
      setMessage('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  // Test the resource endpoint
  const testResource = async () => {
    setLoading(true);
    try {
      const response = await fetch('/resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' })
      });
      const data = await response.json();
      setMessage(`Resource created: ${data.name} (ID: ${data.id})`);
    } catch (error) {
      console.error('Error testing resource:', error);
      setMessage('Error testing resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Data Display Section */}
      <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0' }}>
        <h2>User Data (from MSW)</h2>
        {loading && <p>Loading...</p>}
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>
        )}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        
        <div style={{ marginTop: '10px' }}>
          <button onClick={createUser} disabled={loading}>
            Create New User (POST)
          </button>
          <button onClick={testResource} disabled={loading} style={{ marginLeft: '10px' }}>
            Test Resource (POST)
          </button>
        </div>
      </div>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
