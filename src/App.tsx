
import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AgentRoutes from './routes/CollectorRoutes';
import AdminRoutes from './routes/AdminRoutes'; 

function App() {

  return (
    <>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/collector/*' element={<AgentRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </>
  )
}

export default App;
