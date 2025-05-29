import React from 'react'
import Layout from './Layout/Layout'
import Header from './Layout/Header'
import Sidebar from './Layout/Sidebar'
import Dashboard from './Dashboard'

import "./Stylelayout.css"

const stylelayout = () => {
  return (
    <div>
      <Header></Header>
      <div className="handle">
        <Sidebar></Sidebar><Dashboard></Dashboard>
      </div>
    </div>
  )
}

export default stylelayout
