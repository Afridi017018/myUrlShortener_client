import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import TextInput from '../../components/TextInput/TextInput';
import img from "../../assets/image/logo.png"

import "./auth.css"
import { BASE_URL } from '../../services/helper';

const Signup = () => {

    const navigate = useNavigate();

    const [signupPayload, setSignupPayload] = useState({
        name: "",
        email: "",
        password: "",
    });


    const handleSignup = () => {
        fetch(`${BASE_URL}/user/reg`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(signupPayload),

        })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
                if (data.value === "1") {
                    navigate('/login')
                }
            })

    }

    return (
        <div className="auth">
            <div className="auth__container">
                <img src={img} alt="" />
                <div className="auth__form">
                    <TextInput
                        label="Full name"
                        value={signupPayload.name}
                        onChange={(val) =>
                            setSignupPayload({
                                ...signupPayload,
                                name: val,
                            })
                        }
                        placeholder="John Doe"
                    />
                    <TextInput
                        label="Email"
                        value={signupPayload.email}
                        onChange={(val) =>
                            setSignupPayload({
                                ...signupPayload,
                                email: val,
                            })
                        }
                        placeholder="xyz@email.com"
                    />
                    <TextInput
                        label="Password"
                        value={signupPayload.password}
                        onChange={(val) =>
                            setSignupPayload({
                                ...signupPayload,
                                password: val,
                            })
                        }
                        type="password"
                        placeholder="*****"
                    />
                </div>
                <div className="auth__action">
                    <Button
                        label="Sign up"
                        onClick={handleSignup}
                    />
                    <p>
                        Already have an account? <Link to="/login">Login</Link>
                    </p>



                </div>
            </div>
        </div>
    );
};

export default Signup;


