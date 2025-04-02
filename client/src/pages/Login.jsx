import { useState } from 'react'
import { Button } from '../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: ""
  })

  const changeHandler = (e) => {
    const { name, value } = e.target
    if (isLogin) {
      setLoginInput(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setSignupInput(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('Login Data:', loginInput)
      // Add your login logic here
    } else {
      console.log('Signup Data:', signupInput)
      // Add your signup logic here
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const slideIn = {
    initial: { x: isLogin ? -50 : 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: isLogin ? 50 : -50, opacity: 0 }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 transition-all duration-700">
      <motion.div 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="max-w-md w-full m-4 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
      >
        {/* Enhanced Toggle Switch */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100/80 p-1.5 rounded-2xl flex gap-2 shadow-inner">
            {["Login", "Sign Up"].map((type) => (
              <motion.button
                key={type}
                onClick={() => setIsLogin(type === "Login")}
                className={`relative px-8 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200
                  ${(type === "Login" && isLogin) || (type === "Sign Up" && !isLogin)
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700'}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {((type === "Login" && isLogin) || (type === "Sign Up" && !isLogin)) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                    style={{ zIndex: -1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30 
                    }}
                  />
                )}
                {type}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            variants={slideIn}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <motion.h2 
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </motion.h2>
              <motion.p 
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isLogin 
                  ? "We're glad to see you again" 
                  : "Begin your journey with us"}
              </motion.p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div 
                className="space-y-4"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="initial"
                animate="animate"
              >
                {/* Input fields with enhanced animations */}
                {!isLogin && (
                  <motion.div 
                    variants={fadeIn}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={signupInput.name}
                      onChange={changeHandler}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl 
                        transition-all duration-200 
                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        focus:shadow-lg focus:shadow-indigo-100
                        outline-none group-hover:border-gray-300
                        bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your name"
                    />
                  </motion.div>
                )}

                <motion.div 
                  variants={fadeIn}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={isLogin ? loginInput.email : signupInput.email}
                    onChange={changeHandler}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none
                    group-hover:border-gray-300"
                    placeholder="email@example.com"
                  />
                </motion.div>

                <motion.div 
                  variants={fadeIn}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={isLogin ? loginInput.password : signupInput.password}
                    onChange={changeHandler}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-200 
                    focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none
                    group-hover:border-gray-300"
                    placeholder="••••••••"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                      text-white rounded-xl font-medium 
                      shadow-lg shadow-indigo-200/50 
                      hover:shadow-xl hover:shadow-indigo-300/50 
                      hover:-translate-y-0.5 
                      transition-all duration-200
                      focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLogin ? 'Login ' : 'Create Account'}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Login