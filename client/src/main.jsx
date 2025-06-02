import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider, useSelector } from 'react-redux'
import { appStore, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from './components/ui/sonner'
import { useLoaduserQuery } from './features/api/authApi'
import Loader from './components/Loader'

const Custom = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const { data: user, isLoading } = useLoaduserQuery(undefined, {
    skip: !isAuthenticated
  });

  if (isLoading) return <Loader />;

  return <>{children}</>;
};

createRoot(document.getElementById('root')).render(
  <Provider store={appStore}>
    <PersistGate loading={<Loader />} persistor={persistor}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </PersistGate>
  </Provider>
)
