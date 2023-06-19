import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import img from "../../assets/image/logo.png"
import Button from '../../components/Button/Button';
import TextInput from '../../components/TextInput/TextInput';

const Login = () => {
    const [loginPayload, setLoginPayload] = useState({
        email: "",
        password: ""
      });

      const handleLogin = () => {
        fetch(`http://localhost:4000/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginPayload)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message)
            })
    }
 
      return (
        <div className="auth">
          <div className="auth__container">
          <img src={img} alt="" />
            <div className="auth__form">
              <TextInput
                label="Email"
                value={loginPayload.email}
                onChange={(val) =>
                  setLoginPayload({
                    ...loginPayload,
                    email: val,
                  })
                }
                placeholder="name@email.com"
              />
              <TextInput
                label="Password"
                value={loginPayload.password}
                onChange={(val) =>
                  setLoginPayload({
                    ...loginPayload,
                    password: val,
                  })
                }
                type="password"
              />
            </div>
            <div className="auth__action">
              <Button label="Login" onClick={handleLogin} />
              <p>
                No account yet? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </div>
        </div>
      );
};

export default Login;