import React from 'react'
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ChatAdmin from '../../components/admin/Chats';

const AdminChat: React.FC = () => {
    return (
        <div>
            {/* <Breadcrumbs title="Chats" /> */}
            <ChatAdmin />
        </div>
    )
}
export default AdminChat;