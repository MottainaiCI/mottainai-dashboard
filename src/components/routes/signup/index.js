import { useForm } from "react-hook-form"
import { useContext, useState, useEffect, useCallback } from "preact/hooks"
import { route } from "preact-router"
import { toast } from "react-toastify"

import ThemeContext from "@/contexts/theme"
import TitleContext from "@/contexts/title"
import AuthService from "@/service/auth"
import CaptchaService from "@/service/captcha"
import themes from "@/themes"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import Loader from "@/components/common/loader"

const Signup = () => {
  let [error, setError] = useState(null)
  let [captchaCode, setCaptchaCode] = useState(null)
  let [fetchingCaptcha, setFetchingCaptcha] = useState(false)
  let { theme } = useContext(ThemeContext)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Sign Up")
  }, [setTitle])

  const { register, handleSubmit, setValue } = useForm()

  const onSubmit = ({
    email,
    username,
    password,
    passwordConfirm,
    captcha_id,
    captcha,
  }) => {
    if (
      email &&
      username &&
      password &&
      passwordConfirm &&
      captcha &&
      captcha_id
    ) {
      AuthService.signup(
        email,
        username,
        password,
        passwordConfirm,
        captcha_id,
        captcha
      ).then(
        () => {
          toast.success("Registration successful! You can log in now.")
          route("/login")
        },
        (err) => {
          setError(err.response.data.error)
          refreshCaptcha()
        }
      )
    }
  }

  const refreshCaptcha = useCallback(() => {
    if (fetchingCaptcha) {
      return
    }
    setValue("captcha", "")
    setFetchingCaptcha(true)
    CaptchaService.fetchCode()
      .then(setCaptchaCode, (err) => {
        setError(err.response.data.error)
        refreshCaptcha()
      })
      .then(() => setFetchingCaptcha(false))
  }, [fetchingCaptcha])

  useEffect(refreshCaptcha, [])

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
          <label htmlFor="email" className="block">
            E-mail
          </label>
          <input
            required
            type="email"
            id="email"
            name="email"
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
            autoComplete
            required
            type="password"
            id="password"
            name="password"
            className="text-cultured-black rounded border focus:outline-none
              focus:border-green-mottainai px-2 py-1 min-w-full"
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
            className="text-cultured-black rounded border focus:outline-none
              focus:border-green-mottainai px-2 py-1 min-w-full"
            ref={register}
          />
        </div>

        <div className="mb-4">
          <label className="block">CAPTCHA</label>
          <input
            type="hidden"
            name="captcha_id"
            value={captchaCode}
            ref={register}
          />
          {!captchaCode || fetchingCaptcha ? (
            <div className="py-4">
              <Loader />
            </div>
          ) : (
            <img src={`/api/v1/client/captcha/image/${captchaCode}`} />
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            autoComplete="off"
            id="captcha"
            name="captcha"
            className="text-cultured-black rounded border focus:outline-none
              focus:border-green-mottainai px-2 py-1 flex-1"
            ref={register}
          />
          <div>
            <FontAwesomeIcon
              icon="sync-alt"
              className={`ml-2 cursor-pointer ${fetchingCaptcha && "fa-pulse"}`}
              onClick={refreshCaptcha}
            />
          </div>
        </div>
        <button
          disabled={fetchingCaptcha}
          type="submit"
          className={`focus:outline-none bg-green-mottainai text-white w-full rounded p-1
            ${
              fetchingCaptcha
                ? "disabled:opacity-50 disabled:cursor-not-allowed"
                : ""
            }`}
        >
          Sign Up
        </button>
        {error && <div className="text-center mt-4 text-red-500">{error}</div>}
      </form>
    </div>
  )
}

export default Signup
