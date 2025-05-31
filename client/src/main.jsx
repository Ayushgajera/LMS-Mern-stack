import { StrictMode, use } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider, useSelector } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from './components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import { useLoaduserQuery } from './features/api/authApi'
import Loader from './components/Loader'

const Custom = ({ children }) => {
  const isLoggedIn = useSelector(state => state.auth.userLoggedIn);  // apne store ke hisaab se adjust karo

  const { data: user, isLoading } = useLoaduserQuery(undefined, {
    skip: !isLoggedIn  // jab logged in nahi to query ko skip karo
  });

  if (isLoading) return <Loader />;

  return <>{children}</>;
};

createRoot(document.getElementById('root')).render(


   <Provider store={appStore}>
      <Custom>
         <App />
         <Toaster />
      </Custom>
   </Provider>

)
