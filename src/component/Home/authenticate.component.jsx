import React from "react";
import { useMoralis } from "react-moralis";
import {Link} from 'react-router-dom';
import './authenticate.styles.scss';

function Auth() {
  const { authenticate, isAuthenticated, user } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
      <div className="home"> <p className="title"> Votary|<i className="slanted-title">Flix</i></p>
            <button onClick={() => authenticate()}>Connect Wallet</button>
      </div>
      </div>

    );
  }

  return (
    <div className="home-background">
      <div className="home"> 
        <p className="title">Votary|<i className="slanted-title">Flix</i></p> 
        <Link to="/shop"><button>Enter</button></Link>
      </div>
    </div>
  );
}

export default Auth