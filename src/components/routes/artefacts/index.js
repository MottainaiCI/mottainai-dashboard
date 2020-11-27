import { useState, useEffect, useMemo } from "preact/hooks"

import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import ArtefactService from "@/service/artefact"

const Artefacts = () => {
  const [namespaces, setNamespaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshData = () => {
    ArtefactService.fetchNamespaces()
      .then((namespaces) => {
        setNamespaces(namespaces.map((name) => ({ ID: name })))
      }, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
      },
    ],
    [namespaces]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Artefacts</p>
      {error ? (
        <div>There was a problem retrieving namespaces.</div>
      ) : namespaces.length ? (
        <Table data={namespaces} columns={columns} />
      ) : (
        <div>No namespaces were found.</div>
      )}
    </>
  )
}

export default Artefacts
