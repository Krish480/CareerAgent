import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth() // custom hook to access auth context

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        handleLogin({ email, password }) // call the login function from the auth context
        navigate("/") // navigate to home page after successful login
    }

    // show loading state while the login request is being processed
    if (loading) { 
        return (<main><h1>Loading....</h1></main>)
    }

    return (
        <main>
            <div className='form-container'>
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id='email' placeholder='Enter your email'
                            value={email}
                            required
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }} />
                    </div>

                    <div className='input-group' >
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="password" placeholder='Enter your password'
                            value={password}
                            required
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }} />
                    </div>

                    <button className='button primary-button'>Login</button>

                </form>

                <p>Don't have an account? <Link to={'/register'}>Register</Link ></p>

            </div>
        </main>
    )
}

export default Login