import { useState, useEffect, useMemo, useContext } from "preact/hooks"

import TitleContext from "@/contexts/title"
import UrlManager from "@/contexts/prefix"
import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import ArtefactService from "@/service/artefact"
import { Link } from "preact-router"

const Artefacts = () => {
  const [namespaces, setNamespaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Artefacts")
  }, [setTitle])

  const refreshData = () => {
    ArtefactService.fetchNamespaces()
      .then((namespaces) => {
        setNamespaces(namespaces.map((namespace) => ({ namespace })))
      }, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () => [
      {
        Header: "Namespace",
        accessor: "namespace",
        Cell: ({ row }) => {
          return (
            <Link
              href={UrlManager.buildUrl(`/artefacts/${row.original.namespace}`)}
              className="text-blue-400"
            >
              {row.original.namespace}
            </Link>
          )
        },
      },
    ],
    []
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
        <Table
          data={namespaces}
          columns={columns}
          defaultSortBy={[{ id: "namespace", desc: false }]}
        />
      ) : (
        <div>No namespaces were found.</div>
      )}
    </>
  )
}

export default Artefacts
