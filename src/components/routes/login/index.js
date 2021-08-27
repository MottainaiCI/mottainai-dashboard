import { useForm } from "react-hook-form"
import { useContext, useState, useEffect } from "preact/hooks"
import { route } from "preact-router"

import UserContext from "@/contexts/user"
import ThemeContext from "@/contexts/theme"
import TitleContext from "@/contexts/title"
import UrlManager from "@/contexts/prefix"
import AuthService from "@/service/auth"
import themes from "@/themes"

const Login = () => {
  let [error, setError] = useState(null)
  let { setUser } = useContext(UserContext)
  let { theme } = useContext(ThemeContext)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Login")
  }, [setTitle])

  const { register, handleSubmit } = useForm()

  const onSubmit = ({ remember, username, password }) => {
    if (username && password) {
      AuthService.login(username, password, remember).then(
        (data) => {
          setUser(data)
          route(UrlManager.buildUrl("/"))
        },
        (err) => {
          setError(err.response.data.error)
        }
      )
    }
  }

  return (
    <div
      className={`rounded shadow rounded mx-auto w-min p-8 ${themes[theme].cardContainer}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block">
            Username
          </label>
          <input
            required
            id="username"
            name="username"
            className="text-cultured-black rounded border focus:outline-none
              focus:border-green-mottainai px-2 py-1 min-w-full"
            ref={register}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete
            required
            className="text-cultured-black rounded border focus:outline-none
              focus:border-green-mottainai px-2 py-1 min-w-full"
            ref={register}
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            ref={register}
            className="focus:outline-none"
          />
          <label for="remember" className="ml-2">
            Remember Me
          </label>
        </div>
        <button
          type="submit"
          className="focus:outline-none bg-green-mottainai text-white w-full rounded p-1"
        >
          Log In
        </button>
        {error && <div className="text-center mt-4 text-red-500">{error}</div>}
      </form>
    </div>
  )
}

export default Login
