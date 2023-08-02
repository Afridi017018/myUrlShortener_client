
import { useEffect, useState } from 'react';
import './App.css';
import Appbar from './components/Appbar/Appbar';

import MainRoutes from './Routes';
import { BASE_URL } from './services/helper';

function App() {

  const myToken = localStorage.getItem('token');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("")



  useEffect(() => {
    fetch(`${BASE_URL}/user/check-login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${myToken}`,
      },

    })
      .then(response => response.json())
      .then(data => {
        setUserId(data.id)
        setIsLoggedIn(data.isLoggedIn);
        setIsLoading(false);

      });
  }, [myToken]);
  return (
    <div className='app'>
      <Appbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <MainRoutes isLoggedIn={isLoggedIn} isLoading={isLoading} setIsLoggedIn={setIsLoggedIn} userId={userId} />

    </div>
  );
}

export default App;


