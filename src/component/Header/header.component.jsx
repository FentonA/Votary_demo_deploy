import React from 'react';
import './header.styles.scss';
import {Link} from 'react-router-dom';
import Moralis from 'moralis';
import { useMoralis } from "react-moralis";
import LogoutButton from '../log-out-button.component';


function Header (){
const { authenticate, isAuthenticated, user } = useMoralis();
return (
<div className='header'>
      <Link className='logo-container' to='/'>
        VOTARY | <i>FLIX</i>
      </Link>
      <div className='options'>
        <Link className='option' to='/shop'>
          SHOP
        </Link>
        <Link className='option' to='/mint'>
          CREATE
        </Link>
        <Link className='option' to='/assets'>
          MY COLLECTION
        </Link>
        {isAuthenticated ? (
          <div className='option' >
            WELCOME "{user.get("username")}"
            <LogoutButton/>
          </div>
        ) : (
            <div>
                <button className="headerButton" onClick={() => authenticate()}>Connect Wallet</button>
            </div>

        )}
      </div>
    </div>
  );

    
        }


export default Header