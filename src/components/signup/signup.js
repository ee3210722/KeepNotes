import React, {useState} from 'react'
import "./signup.css";
import { useNavigate } from 'react-router-dom';

export default function Signup(props) {

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmPassword: "" });

    const handleChange = e => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value})
    }

    const handleOnSignup = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password, confirmPassword: credentials.confirmPassword})
        });
        const json = await response.json();
        if (json.success){
            localStorage.setItem('token', json.authToken); 
            props.showAlert("Account Created Succesully", "success");
            navigate("/login");

        }
        else {
            console.log(json);
            props.showAlert("Invalid Credentials", "danger");
        }
    }

    return (
        <div className="login-container">
            <form className="signup" onSubmit={handleOnSignup}>
                <h1>Signup</h1>
                <input type="text" name="name" id="name" value={credentials.name} placeholder="Enter your Name" onChange={handleChange} autoComplete="new-name"></input>
                <input type="text" name="email" id="email" value={credentials.email} placeholder="Enter your Email" onChange={handleChange} autoComplete="new-email"></input>
                <input type="password" name="password" id="password" value={credentials.password}  placeholder="Enter your Password" onChange={handleChange} autoComplete="new-password" minLength="5" required></input>
                <input type="password" name="confirmPassword" id="confirmPassword"  value={credentials.confirmPassword} placeholder="Confirm your Password" onChange={handleChange} autoComplete="new-confirmPassword" minLength="5" required></input>
                <button className="button" type="submit">Signup</button>
                <div>or</div>
                <button className="button" onClick={()=> navigate('/login')}>Login</button>
            </form>
        </div>    
    )
}