import React from 'react';
import DashboardLayout from '../../components/collector/layout/Layout';
import AssignedTasksContent from '../../components/collector/AssignedTasksContent';

const AgentAssignedTasks:React.FC = () => {
  return (
    <DashboardLayout>
      <AssignedTasksContent />
    </DashboardLayout>
  );
};

export default AgentAssignedTasks; 