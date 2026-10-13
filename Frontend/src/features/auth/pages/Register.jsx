import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()

    const {loading, handleRegister} = useAuth() 

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        handleRegister({ username, email, password })
        navigate("/")
    }

    if(loading) {
        return (<main><h1>Loading....</h1></main>)
    }

    return (
        <main>
            <div className='form-container'>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='username'>Username</label>
                        <input type="text" name="username" id='uername' placeholder='Enter username'
                            required
                            onChange={(e) => {
                                setUsername(e.target.value)
                            }}
                            value={username}
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='email'>Email</label>
                        <input type="text" name="email" id='email' placeholder='Enter email address'
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            value={email} 
                            required/>
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input type="text" name="password" id='password' placeholder='Enter password' 
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}/>
                    </div>

                    <button className='button primary-button' >Register</button>
                </form>

                <p>Already have an account? <Link to={"/login"} >login</Link> </p>

            </div>
        </main>
    )
}

export default Register