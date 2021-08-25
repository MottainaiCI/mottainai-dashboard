import { useState, useEffect, useMemo, useContext } from "preact/hooks"
import { toast } from "react-toastify"

import TitleContext from "@/contexts/title"
import UrlManager from "@/contexts/prefix"
import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Loader from "@/components/common/loader"
import NodeService from "@/service/node"
import { showConfirmModal } from "@/components/common/modal"
import { Link } from "preact-router"
import Button from "@/components/common/button"
import dayjs from "@/day"

const Nodes = () => {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Nodes")
  }, [setTitle])

  const refreshData = (setLoadingFlag = true) => {
    if (setLoadingFlag) {
      setLoading(true)
    }
    NodeService.fetchAll()
      .then(setNodes, setError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refreshData()

    const intId = setInterval(() => {
      refreshData(false)
    }, 30 * 1000)

    return () => clearInterval(intId)
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({ row }) => {
          return (
            <Link href={UrlManager.buildUrl(`/nodes/${row.original.ID}`)} className="text-blue-400">
              {row.original.ID}
            </Link>
          )
        },
      },
      {
        Header: "Hostname",
        accessor: "hostname",
      },
      {
        Header: "Last Report",
        accessor: (d) => {
          if (d.last_report) {
            return dayjs().to(dayjs(d.last_report))
          }
        },
      },
      {
        id: "Actions",
        Cell: ({ row }) => {
          const actionOptions = [
            {
              label: "Delete",
              onClick(row) {
                showConfirmModal({
                  body: `Are you sure you want to delete Node ${row.original.ID}?`,
                }).then((confirmed) => {
                  if (confirmed) {
                    NodeService.delete(row.original.ID).then(() => {
                      setNodes(
                        nodes.filter((item) => item.ID !== row.original.ID)
                      )
                    })
                  }
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
    [nodes]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold mb-2">Nodes</div>
        <div className="mb-2">
          <Button
            onClick={() => {
              NodeService.createNode().then(refreshData, () => {
                toast.error("There was an error creating a node")
              })
            }}
          >
            New Node
          </Button>
        </div>
      </div>

      {error ? (
        <div>There was a problem retrieving nodes.</div>
      ) : nodes.length ? (
        <Table data={nodes} columns={columns} />
      ) : (
        <div>No nodes were found.</div>
      )}
    </>
  )
}

export default Nodes
