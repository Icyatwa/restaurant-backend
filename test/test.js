import { SignIn } from "@clerk/clerk-react"
import './auth.css'
 
export default function SignInPage() {
  return (
    <div className="authCtn">
      <SignIn />
    </div>
  )
}


import { SignUp } from "@clerk/clerk-react"
import './auth.css'

export default function SignUpPage() {
  return (
    <div className="authCtn">
      <SignUp />
    </div>
  )
}

// DashboardLayout.js
import * as React from 'react'
import { useAuth } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"
 
export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()
  
  console.log('test', userId)
 
  React.useEffect(() => {
    if (!userId) {
      navigate("/")
    }
  }, [])
 
  if (!isLoaded) return "Loading..."
 
  return (
    <Outlet />
  )
}