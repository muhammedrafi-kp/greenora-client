import React from 'react'
import Navbar from '../../components/agent/Navbar';
import AgentLogin from '../../components/agent/Login';


const AgentLoginPage:React.FC = () => {
  return (
    <div>
      <Navbar/>
      <AgentLogin/>
    </div>
  )
}

export default AgentLoginPage;
