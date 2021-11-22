import React from "react";
import ReactDOM from "react-dom";
import {Switch, Route, Redirect, BrowserRouter} from 'react-router-dom';
import MintPage from "./pages/MintPage/mint-page";
import App from './App';
import { MoralisProvider } from "react-moralis";
import Moralis from 'moralis'
import Auth from "./component/Home/authenticate.component"
import MyAssets from "./pages/Assets/mylist.pages";
import MarketPlace from "./pages/Market/marketplace-pages";
import Header from './component/Header/header.component'
import './index.css'
ReactDOM.render(
  <MoralisProvider appId="JiZf9kePszLyIPS8UJOZwDXdneZakq715HW5Rrgy" serverUrl="https://xfz6css3babt.usemoralis.com:2053/server">
    <BrowserRouter>
      <Header/>
    <Switch>
      <Route exact path='/' component={Auth}/>
      <Route exact path='/shop' component = {MarketPlace} />
      <Route exact path='/mint' component = {MintPage} />
      <Route exact path='/assets' component = {MyAssets} />
    </Switch>
    </BrowserRouter>
  </MoralisProvider>,
  document.getElementById("root"),
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

