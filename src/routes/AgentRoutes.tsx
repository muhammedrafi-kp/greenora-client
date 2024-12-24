import {Routes,Route} from 'react-router-dom';


import React from 'react'
import AgentLoginPage from '../pages/agent/AgentLogin';
import AgentSignUpPage from '../pages/agent/AgentSignUpPage';

const AgentRoutes:React.FC = () => {
  return (
    <Routes>
        <Route path='/login' element={<AgentLoginPage/>}/>
        <Route path='/signup' element={<AgentSignUpPage/>}/>
    </Routes>
  )
}

export default AgentRoutes
