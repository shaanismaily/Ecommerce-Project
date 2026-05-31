import { registerUser } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, } = useForm()

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        setError(null)

        try {
            const userData = await registerUser(data.username, data.email, data.password)
            if (userData) navigate("/login")
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed")
        } finally {
            setLoading(false)
        }
    }

    return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="field">
            <label className="field-label" htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className="field-input"
              {...register("username", {
                required: "Username is required",
                pattern: {
                    value: /^[a-zA-Z0-9_]{3,20}$/,
                    message: "Username must be 3-20 characters",
                    },
              })}
            />

            {errors.username && (
              <p className="form-error">{errors.username.message}</p>
            )}
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="field-input"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
            />

            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="field-input"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}