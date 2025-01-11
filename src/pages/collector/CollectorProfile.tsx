import React from 'react'
import DashboardLayout from '../../components/collector/layout/Layout';
import Profile from "../../components/collector/Profile"

const CollectorProfile:React.FC = () => {
  return (
    <div>
      <DashboardLayout>
        <Profile/>
      </DashboardLayout>
    </div>
  )
}

export default CollectorProfile
