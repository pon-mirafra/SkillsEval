import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { signIn } from "../Api-config/auth.api";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (data) => {
    try {
      const loginResponse = await signIn(data);

      // if (loginResponse.data.message) {
      //   sessionStorage.setItem("email", data.email); // Store email in local storage
      //   navigate("/createlink");

      if (loginResponse.data.token) { // Ensure token is present
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("token", loginResponse.data.token); // Store token in sessionStorage
        navigate("/createlink");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-3xl font-bold mb-2 text-center text-sky-800">SkillsEval</h2>
        <p className="mb-3 text-center text-base">Enter Credentials to Sign-in</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-center text-base">Enter your email</label>
            <input
              type="email"
              id="email"
              className={`form-input mt-2 py-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400 text-center ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Email"
              {...register('email', { onChange: (e) => setEmail(e.target.value) })}
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-center text-base">Enter your password</label>
            <input
              type="password"
              id="password"
              className={`form-input mt-2 py-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-400 text-center ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Password"
              {...register('password', { onChange: (e) => setPassword(e.target.value) })}
            />
            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
            {loginError && <p className="text-red-500 mt-1">{loginError}</p>} {/* Display login error message */}
            <p className="mt-2 text-right"><a href="#" className="text-blue-500 hover:underline">Forget password?</a></p>
          </div>
          <button
            type="submit"
            className="bg-sky-800 hover:bg-sky-900 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
          <p className="mt-4 text-sm text-center text-slate-400">By Clicking Login, You Agree To Our</p>
          <p className="mb-4 text-sm text-center">Terms of Service <span className="text-slate-400">And</span> Privacy Policy</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
