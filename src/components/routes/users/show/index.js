import { useContext, useEffect, useState } from "preact/hooks"

import TitleContext from "@/contexts/title"
import Loader from "@/components/common/loader"
import UserService from "@/service/user"
import Pill from "@/components/common/pill"

const ShowUser = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`User ${userId}`)
  }, [userId, setTitle])

  useEffect(() => {
    UserService.fetchUser(userId)
      .then(setUser, setError)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">User {userId}</p>
      {error ? (
        <div>There was a problem retrieving the user.</div>
      ) : user ? (
        <>
          <div className="flex mb-2">
            <Pill>Name: {user.name}</Pill>
            <Pill>Email: {user.email}</Pill>
            <Pill>
              Role:
              {user.is_admin
                ? " Admin"
                : user.is_manager
                ? " Manager"
                : " User"}
            </Pill>
          </div>
        </>
      ) : (
        <div>User was not found.</div>
      )}
    </>
  )
}

export default ShowUser
