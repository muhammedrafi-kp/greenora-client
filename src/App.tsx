
import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AgentRoutes from './routes/AgentRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {

  return (
    <>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/agent/*' element={<AgentRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </>
  )
}

export default App
