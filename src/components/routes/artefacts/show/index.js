import ArtefactService from "@/service/artefact"
import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import { useContext, useEffect, useMemo, useState } from "preact/hooks"
import Loader from "@/components/common/loader"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { Link } from "preact-router"

const ShowArtefacts = ({ namespace }) => {
  const [artefacts, setArtefacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`${namespace} Artefacts`)
  }, [namespace, setTitle])

  useEffect(() => {
    ArtefactService.fetchArtefacts(namespace)
      .then((artefacts) => {
        if (artefacts) {
          setArtefacts(artefacts.map((name) => ({ ID: name })))
        }
      }, setError)
      .finally(() => setLoading(false))
  }, [namespace])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({ row }) => {
          return (
            <a
              href={`/public/namespace/${namespace}/${row.original.ID}`}
              className="text-blue-400"
              target="_blank"
              rel="noreferrer"
            >
              {row.original.ID}
            </a>
          )
        },
      },
    ],
    [namespace]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl font-bold">{namespace} Artefacts</div>
        <Link href="/artefacts" className="text-sm">
          <FontAwesomeIcon icon="caret-left" className="mr-1" />
          back to all artefacts
        </Link>
      </div>
      {error ? (
        <div>There was a problem retrieving artefacts.</div>
      ) : artefacts.length ? (
        <Table data={artefacts} columns={columns} />
      ) : (
        <div>No artefacts were found.</div>
      )}
    </>
  )
}

export default ShowArtefacts
