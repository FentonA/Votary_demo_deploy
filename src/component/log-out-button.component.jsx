import React from "react";
import { useMoralis } from "react-moralis";
import './Header/header.styles.scss';

const LogoutButton = () => {
    const { logout, isAuthenticating } = useMoralis();
  
    return (
      <button className="headerButton" onClick={() => logout()} disabled={isAuthenticating}>
        LOGOUT
      </button>
    )
  };
  
  export default LogoutButton