import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login as loginAction } from "../store/authSlice"
import { loginUser } from "../api/auth"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setError(null)
    setLoading(true)

    try {
      const userData = await loginUser(data.email, data.password)

      // save user to redux
      dispatch(loginAction(userData))

      navigate("/profile")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Check your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}