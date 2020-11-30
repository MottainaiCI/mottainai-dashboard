import { useState, useEffect, useMemo, useContext } from "preact/hooks"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import TokenService from "@/service/token"
import Dropdown from "@/components/common/dropdown"
import { showConfirmModal } from "@/components/common/modal"
import Button from "@/components/common/button"

const Tokens = () => {
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("API Tokens")
  }, [setTitle])

  const refreshData = () => {
    TokenService.fetchTokens()
      .then(setTokens, setError)
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
        Header: "Key",
        accessor: "key",
      },
      {
        id: "Actions",
        Cell: ({ row }) => {
          const actionOptions = [
            {
              label: "Delete",
              onClick(row) {
                showConfirmModal({
                  body: `Are you sure you want to delete Token ${row.original.id}?`,
                }).then(() => {
                  TokenService.delete(row.original.id).then(() => {
                    setTokens(
                      tokens.filter((item) => item.id !== row.original.id)
                    )
                  })
                })
              },
            },
          ]

          return (
            <Dropdown
              label="Actions"
              options={actionOptions}
              actionArgs={[row]}
            />
          )
        },
      },
    ],
    [tokens]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl font-bold mb-2">API Tokens</p>
        <div className="mb-2">
          <Button
            onClick={() => {
              TokenService.create().then(refreshData)
            }}
          >
            Create New Token
          </Button>
        </div>
      </div>
      {error ? (
        <div>There was a problem retrieving tokens.</div>
      ) : tokens.length ? (
        <Table
          data={tokens}
          columns={columns}
          defaultSortBy={[{ id: "id", desc: true }]}
        />
      ) : (
        <div>No tokens were found.</div>
      )}
    </>
  )
}

export default Tokens
