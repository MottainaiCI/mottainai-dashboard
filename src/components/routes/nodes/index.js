import { useState, useEffect, useMemo } from "preact/hooks"
import dayjs from "@/day"

import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Spinner from "@/components/spinner"
import NodeService from "@/service/node"
import { showConfirmModal } from "@/components/common/modal"

const Nodes = () => {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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
                const onConfirm = () => {
                  NodeService.delete(row.original.ID).then(() => {
                    setNodes(
                      tasks.filter((item) => item.ID !== row.original.ID)
                    )
                  })
                }

                showConfirmModal({
                  body: `Are you sure you want to delete Node ${row.original.ID}?`,
                  onConfirm,
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
    return <Spinner />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Nodes</p>
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
