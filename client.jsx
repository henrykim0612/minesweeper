import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./components/MineSweeper";
import {hot} from "react-hot-loader/root";
const Hot = hot(Main);
ReactDOM.render(
  <Hot />,
  document.getElementById('root')
)
