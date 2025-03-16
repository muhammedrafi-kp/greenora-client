import React from 'react'
import Layout from '../../components/admin/layout/Layout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ChatAdmin from '../../components/admin/ChatAdmin';

const AdminChat: React.FC = () => {
    return (
        <div>
            <Layout>
                <Breadcrumbs title="Chats" />
                <ChatAdmin />
            </Layout>
        </div>
    )
}
export default AdminChat;