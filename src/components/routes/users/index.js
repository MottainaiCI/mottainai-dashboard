import { useState, useEffect, useMemo } from "preact/hooks"

import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import UserService from "@/service/user"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshData = (setLoadingFlag = true) => {
    UserService.getAllusers()
      .then(setUsers, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Role",
        accessor: (d) => {
          if (d.is_admin) {
            return "Admin"
          } else if (d.is_manager) {
            return "Manager"
          } else {
            return "User"
          }
        },
      },
    ],
    [users]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Users</p>
      {error ? (
        <div>There was a problem retrieving users.</div>
      ) : users.length ? (
        <Table data={users} columns={columns} />
      ) : (
        <div>No users were found.</div>
      )}
    </>
  )
}

export default Users
