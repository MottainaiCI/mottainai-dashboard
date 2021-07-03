import { useState, useEffect, useMemo, useContext } from "preact/hooks"
import { route } from "preact-router"

import { showConfirmModal } from "@/components/common/modal"
import TitleContext from "@/contexts/title"
import UserContext from "@/contexts/user"
import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import UserService from "@/service/user"
import { Link } from "preact-router"
import Button from "@/components/common/button"
import Dropdown from "@/components/common/dropdown"
import { toast } from "react-toastify"

const Users = () => {
  let { user: currentUser } = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Users")
  }, [setTitle])

  const refreshData = () => {
    UserService.getAllusers()
      .then(setUsers, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () =>
      [
        {
          Header: "ID",
          accessor: "id",
          Cell: ({ row }) => {
            return (
              <Link
                href={`/users/${row.original.id}`}
                className="text-blue-400"
              >
                {row.original.id}
              </Link>
            )
          },
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
            if (d.is_admin === "yes") {
              return "Admin"
            } else if (d.is_manager === "yes") {
              return "Manager"
            }
            return "User"
          },
        },
        currentUser.is_admin
          ? {
              id: "Actions",
              Cell: ({ row }) => {
                return (
                  <Dropdown
                    label="Actions"
                    actionArgs={[row.original]}
                    options={[
                      {
                        label: "Edit",
                        onClick(user) {
                          route(`/users/${user.id}/edit`)
                        },
                      },
                      currentUser.id !== row.original.id && {
                        label: "Delete",
                        onClick(user) {
                          return showConfirmModal({
                            body: `Are you sure you want to delete ${user.name} (${user.id})?`,
                          }).then((confirmed) => {
                            if (confirmed) {
                              return UserService.deleteUser(user.id)
                                .then(() => {
                                  toast.success("User deleted")
                                  refreshData()
                                })
                                .catch((err) => {
                                  toast.error(err.response.data.error)
                                })
                            }
                          })
                        },
                      },
                    ].filter(Boolean)}
                  />
                )
              },
            }
          : null,
      ].filter(Boolean),
    []
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl font-bold mb-2">Users</p>
        {currentUser.is_admin && (
          <div className="mb-2">
            <Button onClick={() => route("/users/new")}>New User</Button>
          </div>
        )}
      </div>
      {error ? (
        <div>There was a problem retrieving users.</div>
      ) : users.length ? (
        <Table
          data={users}
          columns={columns}
          defaultSortBy={[{ id: "id", desc: true }]}
        />
      ) : (
        <div>No users were found.</div>
      )}
    </>
  )
}

export default Users
