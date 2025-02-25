import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import "./LoginForm.css";

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userScopes, setUserScopes] = useState([]);

  const onSubmit = (data) => {
    login(data);
  };

  const login = (data) => {
    fetch("http://127.0.0.1:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((r) => r.json())
      .then((response) => {
        if (response.auth) {
          setLoginSuccess(true);
          setUserScopes(response.scopes || []);
        } else {
          alert(`Tentativa de login fracassada: ${response.message}`);
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  };

  useEffect(() => {
    if (loginSuccess && userScopes.length > 0) {
      if (userScopes.includes("administrador")) {
        navigate("/produtos");
        window.location.reload();
      } else if
        (userScopes.includes("utilizador")) {
        navigate("/produtos");
        window.location.reload();
      } else {
        alert("Utilizador não tem permissões adequadas");
      }
    }
  }, [loginSuccess, userScopes, navigate]);


  return (
    <div className="loginForm">
      <h2>Login</h2>
      <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Username:</label>
          <input className="username" {...register("username")} />
        </div>
        <div className="field">
          <label>Password:</label>
          <input className="password" type="password" {...register("password")} />
        </div>
        <input className="submit" type="submit" />
      </form>
      <div className="forgot-link">
        <Link to="/recover">Redefinir palavra-passe</Link>
      </div>
      <div className="register-link">
        <Link to="/registar">Registar novo utilizador</Link>
      </div>
      <div className="return-link">
        <Link to="/produtos">🡸 Voltar para a página de produtos</Link>
      </div>
    </div>
  );
};

export default Login;
