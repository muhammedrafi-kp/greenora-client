import React from 'react'
import AgentNavbar from '../../components/agent/AgentNavbar';
import AgentLogin from '../../components/agent/AgentLogin';

const AgentLoginPage:React.FC = () => {
  return (
    <div>
      <AgentNavbar/>
      <AgentLogin/>
    </div>
  )
}

export default AgentLoginPage;
