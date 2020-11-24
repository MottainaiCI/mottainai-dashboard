import { useState, useEffect, useMemo } from "preact/hooks"

import Table from "@/components/common/table"
import Spinner from "@/components/spinner"
import ArtefactService from "@/service/artefact"

const Artefacts = () => {
  const [namespaces, setNamespaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshData = (setLoadingFlag = true) => {
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
    return <Spinner />
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
