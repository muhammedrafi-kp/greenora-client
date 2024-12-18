import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/user/HomePage';


const UserRoutes: React.FC = () => {
    return (
        
        <Routes>
            <Route path='/' element={<HomePage/>}/>
        </Routes>
    )
}

export default UserRoutes;
