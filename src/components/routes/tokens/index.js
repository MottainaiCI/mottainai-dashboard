import { useState, useEffect, useMemo, useContext } from "preact/hooks"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import TokenService from "@/service/token"

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
    ],
    []
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">API Tokens</p>
      {error ? (
        <div>There was a problem retrieving tokens.</div>
      ) : tokens.length ? (
        <Table data={tokens} columns={columns} />
      ) : (
        <div>No tokens were found.</div>
      )}
    </>
  )
}

export default Tokens
