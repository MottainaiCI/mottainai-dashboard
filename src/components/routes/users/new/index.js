import { useForm } from "react-hook-form"
import { useEffect, useContext, useRef, useState } from "preact/hooks"
import { route } from "preact-router"
import { Link } from "preact-router/match"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { toast } from "react-toastify"

import TitleContext from "@/contexts/title"
import UserContext from "@/contexts/user"
import UrlManager from "@/contexts/prefix"
import Button from "@/components/common/button"
import UserService from "@/service/user"

const NewUser = () => {
  let { user: currentUser } = useContext(UserContext)
  if (!currentUser.is_admin) {
    route(UrlManager.buildUrl("/users"))
  }

  let [error, setError] = useState(null)
  let [loading, setLoading] = useState(null)

  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("New User")
  }, [setTitle])

  const { register, handleSubmit } = useForm()

  const onSubmit = (values) => {
    UserService.createUser(values).then(
      (data) => {
        toast.success("User created")
        route(UrlManager.buildUrl("/users"))
      },
      (err) => {
        setError(err.response.data.error)
      }
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl font-bold">New User</div>
        <Link href={UrlManager.buildUrl('/users')} className="text-sm">
          <FontAwesomeIcon icon="caret-left" className="mr-1" />
          back to all users
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                focus:border-green-mottainai px-2 py-1 w-min"
            ref={register}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block">
            Username
          </label>
          <input
            required
            id="name"
            name="name"
            className="text-cultured-black rounded border focus:outline-none
                focus:border-green-mottainai px-2 py-1 w-min"
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
                focus:border-green-mottainai px-2 py-1 w-min"
            ref={register}
          />
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="manager"
            name="manager"
            ref={register}
            className="focus:outline-none"
          />
          <label for="manager" className="ml-2">
            Manager
          </label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="admin"
            name="admin"
            ref={register}
            className="focus:outline-none"
          />
          <label for="admin" className="ml-2">
            Admin
          </label>
        </div>
        {error && <div className="text-center mt-4 text-red-500">{error}</div>}
        <div className="flex flex-row justify-between">
          <Button
            className="mt-2"
            type="button"
            onClick={() => route(UrlManager.buildUrl("/users"))}
          >
            Cancel
          </Button>
          <Button className="mt-2" type="submit" disabled={loading}>
            Create
          </Button>
        </div>
      </form>
    </>
  )
}

export default NewUser
