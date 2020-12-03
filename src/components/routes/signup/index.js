import { useForm } from "react-hook-form"
import { useContext, useState, useEffect } from "preact/hooks"
import { route } from "preact-router"
import { toast } from "react-toastify"

import ThemeContext from "@/contexts/theme"
import TitleContext from "@/contexts/title"
import UserService from "@/service/user"
import themes from "@/themes"

const Signup = () => {
  let [error, setError] = useState(null)
  let { theme } = useContext(ThemeContext)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Sign Up")
  }, [setTitle])

  const { register, handleSubmit } = useForm()

  const onSubmit = ({ email, username, password, passwordConfirm }) => {
    if (email && username && password && passwordConfirm) {
      UserService.signup(email, username, password, passwordConfirm).then(
        () => {
          toast.success("Registration successful! You can log in now.")
          route("/login")
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
            className="text-cultured-black rounded border focus:outline-none focus:border-green-mottainai px-2 py-1"
            ref={register}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block">
            E-mail
          </label>
          <input
            required
            type="email"
            id="email"
            name="email"
            className="text-cultured-black rounded border focus:outline-none focus:border-green-mottainai px-2 py-1"
            ref={register}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            autoComplete
            required
            type="password"
            id="password"
            name="password"
            className="text-cultured-black rounded border focus:outline-none focus:border-green-mottainai px-2 py-1"
            ref={register}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="passwordConfirm" className="block">
            Confirm Password
          </label>
          <input
            autoComplete
            required
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            className="text-cultured-black rounded border focus:outline-none focus:border-green-mottainai px-2 py-1"
            ref={register}
          />
        </div>
        <button
          type="submit"
          className="focus:outline-none bg-green-mottainai text-white w-full rounded p-1"
        >
          Sign Up
        </button>
        {error && <div className="text-center mt-4 text-red-500">{error}</div>}
      </form>
    </div>
  )
}

export default Signup
