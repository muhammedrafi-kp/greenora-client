import './App.css';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AgentRoutes from './routes/CollectorRoutes';
import AdminRoutes from './routes/AdminRoutes';
import Error500 from './components/common/Error500';

function App() {

  return (
    <>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/collector/*' element={<AgentRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/error/500' element={<Error500 />} />
      </Routes>
    </>
  )
}

export default App;
