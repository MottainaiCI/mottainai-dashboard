import { useContext, useEffect, useState } from "preact/hooks"
import { Link, route } from "preact-router"

import TitleContext from "@/contexts/title"
import Loader from "@/components/common/loader"
import NodeService from "@/service/node"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import Dropdown from "@/components/common/dropdown"
import Table from "@/components/common/table"
import { taskTableColumns } from "@/components/common/tasks"
import { showConfirmModal } from "@/components/common/modal"
import KVTable from "@/components/common/kv_table"
import { relativeTimeFormatFn } from "@/util"

const ShowNode = ({ nodeId }) => {
  const [node, setNode] = useState(null)
  const [nodeTasks, setNodeTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`Node ${nodeId}`)
  }, [nodeId, setTitle])

  useEffect(() => {
    setLoadingTasks(true)
    NodeService.fetch(nodeId)
      .then((data) => {
        NodeService.fetchTasks(data.key)
          .then(setNodeTasks)
          .finally(() => setLoadingTasks(false))
        return data
      })
      .then(setNode, (err) => {
        if (err.response.status === 404) {
          setError("Node not found")
        } else {
          setError("There was a problem retrieving the node")
        }
      })
      .finally(() => setLoading(false))
  }, [nodeId])

  const actionOptions = [
    {
      label: "Delete",
      onClick(id) {
        return showConfirmModal({
          body: `Are you sure you want to delete Node ${id}?`,
        }).then((confirmed) => {
          if (confirmed) {
            NodeService.delete(id).then(() => route("/nodes"))
          }
        })
      },
    },
  ]

  if (loading) {
    return <Loader />
  }

  let body = (() => {
    if (error) {
      return <div>{error}</div>
    }

    return (
      <>
        <KVTable
          object={node}
          keys={["ID", "last_report", "nodeid", "key", "user", "pass"]}
          formatters={{
            last_report: relativeTimeFormatFn,
          }}
          fieldFormatters={{
            last_report: () => "Last Report",
            nodeid: () => "Hardware Id",
            key: () => "Agent Key",
            user: () => "Broker User",
            pass: () => "Broker Pass",
          }}
        />

        <div className="text-xl font-bold mb-2">
          Tasks executed by this node
        </div>
        {loadingTasks ? (
          <Loader />
        ) : nodeTasks && nodeTasks.length ? (
          <Table
            data={nodeTasks}
            columns={taskTableColumns({
              refreshTasks: () => {
                NodeService.fetchTasks(node.key).then(setNodeTasks)
              },
              setTasks: setNodeTasks,
              tasks: nodeTasks,
            })}
          />
        ) : (
          <div>No tasks were found</div>
        )}
      </>
    )
  })()

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl font-bold">Node {nodeId}</div>
        <div className="flex justify-between items-center">
          <Link href="/nodes" className="text-sm mr-1">
            <FontAwesomeIcon icon="caret-left" className="mr-1" />
            back to all nodes
          </Link>
          <Dropdown
            label={<FontAwesomeIcon icon="cog" />}
            anchor="right-0"
            options={actionOptions}
            actionArgs={[node && node.ID]}
          />
        </div>
      </div>
      {body}
    </>
  )
}

export default ShowNode
