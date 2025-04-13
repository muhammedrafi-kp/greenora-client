import React from 'react'
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ChatAdmin from '../../components/admin/ChatAdmin';

const AdminChat: React.FC = () => {
    return (
        <div>
            <Breadcrumbs title="Chats" />
            <ChatAdmin />
        </div>
    )
}
export default AdminChat;