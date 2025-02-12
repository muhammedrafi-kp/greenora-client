import React from 'react';
import Layout from '../../components/collector/layout/Layout';
import AssignedTasksContent from '../../components/collector/AssignedTasksContent';

const AgentAssignedTasks:React.FC = () => {
  return (
    <Layout>
      <AssignedTasksContent />
    </Layout>
  );
};

export default AgentAssignedTasks; 