import React from 'react'
import NavBar from '../../components/user/Navbar'
import AccountLayout from '../../components/user/AccountLayout/AccountLayout'

const UserAccount: React.FC = () => {
    return (
        <>
            <NavBar />
            {/* <Account> */}
                {/* <Activity /> */}
            <AccountLayout/>
        </>
    )
}

export default UserAccount
