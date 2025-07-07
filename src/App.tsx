import './App.css';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const UserRoutes = lazy(() => import('./routes/UserRoutes'));
const AgentRoutes = lazy(() => import('./routes/CollectorRoutes'));
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const Error500 = lazy(() => import('./components/common/Error500'));
import Spinner from './components/common/Spinner';
function App() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path='/*' element={<UserRoutes />} />
          <Route path='/collector/*' element={<AgentRoutes />} />
          <Route path='/admin/*' element={<AdminRoutes />} />
          <Route path='/error/500' element={<Error500 />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App;
