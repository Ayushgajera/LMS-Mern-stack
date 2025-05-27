import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'
function mainLayout() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default mainLayout
