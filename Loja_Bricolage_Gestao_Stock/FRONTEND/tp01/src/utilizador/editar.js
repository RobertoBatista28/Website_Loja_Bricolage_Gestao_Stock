import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./editar.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const today = new Date();
  const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  sixteenYearsAgo.setHours(0, 0, 0, 0);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const maxDate = formatDate(sixteenYearsAgo);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

        let token = '';
        try {
          const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
          token = parsedCookie.token;
        } catch (error) {
          if (!token) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            window.location.href = "/login";
          }
          console.error('Erro ao extrair token do cookie:', error);
        }

        const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
          setValue("username", userData.username || "");
          setValue("nome", userData.nome || "");
          setValue("morada", userData.morada || "");
          setValue("telemovel", userData.telemovel || "");
          const formattedDate = userData.dataNascimento ? new Date(userData.dataNascimento).toISOString().substr(0, 10) : "";
          setValue("dataNascimento", formattedDate);
          setValue("nif", userData.nif || "");
          setValue("email", userData.email || "");
          setLoading(false);
        } else {
          console.error(`Erro ao carregar os dados do utilizador: ${response.status}`);
          alert("Erro ao carregar os dados do utilizador. Tente novamente mais tarde.");
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do utilizador:", error);
        alert("Erro ao carregar os dados do utilizador. Verifique sua conexão ou tente novamente mais tarde.");
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const cookieValue = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"));

      let token = '';
      const parsedCookie = JSON.parse(cookieValue.replace(/^j:/, ''));
      token = parsedCookie.token;


      const modifiedFields = {};
      if (data.username !== userData.username) {
        modifiedFields.username = data.username;
      }
      if (data.nome !== userData.nome) {
        modifiedFields.nome = data.nome;
      }
      if (data.morada !== userData.morada) {
        modifiedFields.morada = data.morada;
      }
      if (data.telemovel !== userData.telemovel) {
        modifiedFields.telemovel = data.telemovel;
      }
      if (data.dataNascimento !== userData.dataNascimento) {
        modifiedFields.dataNascimento = data.dataNascimento;
      }
      if (data.nif !== userData.nif) {
        modifiedFields.nif = data.nif;
      }
      if (data.email !== userData.email) {
        modifiedFields.email = data.email;
      }

      const response = await fetch("http://127.0.0.1:3001/menu/utilizador/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `Bearer ${token}`,
        },
        body: JSON.stringify(modifiedFields),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.logout) {
          // Username was changed, logout the user
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          alert("Nome de utilizador atualizado. Por favor, faça login novamente.");
          navigate("/login");
        } else {
          alert("Dados do utilizador atualizados com sucesso!");
          navigate("/me");
        }
      } else {
        const errorData = await response.json();
        alert(`Erro ao editar utilizador: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro ao editar utilizador:", error);
      alert("Erro ao editar utilizador. Verifique sua conexão ou tente novamente mais tarde.");
    }
  };

  if (loading) {
    return <p>Carregando dados do utilizador...</p>;
  }

  return (
    <div className="editProfile">
      <h2>Editar Perfil</h2>
      <form className="form-edit" onSubmit={handleSubmit(onSubmit)}>
        <div className="fielde">
          <label>Username:</label>
          <input className="username" {...register("username", { required: true })} />
          {errors.username && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="fielde">
          <label>Nome:</label>
          <input className="username" {...register("nome", { required: true })} />
          {errors.nome && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="fielde">
          <label>Morada:</label>
          <input className="username" {...register("morada", { required: true })} />
          {errors.morada && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="fielde">
          <label>Telemóvel:</label>
          <input className="username" {...register("telemovel", { required: true })} />
          {errors.telemovel && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="fielde">
          <label>Data de Nascimento:</label>
          <input
            className="username"
            type="date"
            max={maxDate}
            {...register("dataNascimento", { required: true })}
          />
          {errors.dataNascimento && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="field">
          <label>NIF:</label>
          <input className="username" {...register("nif", { required: true })} />
          {errors.nif && <span className="error-message">Este campo é obrigatório.</span>}
        </div>
        <div className="field">
          <label>Email:</label>
          <input
            className="email-reg"
            type="email"
            {...register("email", {
              required: "Este campo é obrigatório.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Por favor, introduza um email válido.",
              },
            })}
          />
          {errors.email && (
            <span className="error-message">
              {errors.email.message}
            </span>
          )}
        </div>
        <input className="submit" type="submit" value="Atualizar" />
      </form>
    </div>
  );
};

export default EditProfile;
