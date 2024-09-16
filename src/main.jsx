// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import "./assets/styles/reset.css"
import "./assets/styles/index.css"
import { createRoot } from "react-dom/client";

import { App } from "./App";

//bir eleman seç
const rootEl = document.getElementById("root");

//bu dom eleman objesini react güçleri ile donatacağız

//verbose

const root = createRoot(rootEl);

root.render(
 <App/>
);

//JSX syntax extension to JavaScript
