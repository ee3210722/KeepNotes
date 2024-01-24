import React, {useState} from 'react'
import "./login.css"
import { useNavigate } from 'react-router-dom';

export default function Login(props) {

    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" }) 


    const handleOnLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        if (json.success){
            localStorage.setItem('token', json.authToken); 
            props.showAlert("Logged in Succesully", "success");
            navigate("/");

        }
        else{
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    const handleChange = e => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className="login-container">
            <form className="login" onSubmit={handleOnLogin}>
                <h1>Login</h1>
                <input type="text" name="email" id="email" value={credentials.email} placeholder="Enter your Email" onChange={handleChange} autoComplete="new-email"></input>
                <input type="password" name="password" id="password" value={credentials.password} placeholder="Enter your Password" onChange={handleChange} autoComplete="new-password"></input>
                <button className="button" type="submit">Login</button>
                <div>or</div>
                <button className="button" onClick={()=> navigate('/signup')}>Signup</button>
            </form>
        </div>
    )
}