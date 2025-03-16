import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AgentRoutes from './routes/CollectorRoutes';
import AdminRoutes from './routes/AdminRoutes';
// import ResetPassword from './pages/ResetPassword';
// import CollectorResetPassword from './pages/CollectorResetPassword';

function App() {

  return (
    <>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        {/* <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/collector/reset-password/:token' element={<CollectorResetPassword />} /> */}
        <Route path='/collector/*' element={<AgentRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </>
  )
}

export default App;
