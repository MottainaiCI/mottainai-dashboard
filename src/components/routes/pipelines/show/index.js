import { useContext, useEffect, useState } from "preact/hooks"
import { Link, route } from "preact-router"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import TitleContext from "@/contexts/title"
import Loader from "@/components/common/loader"
import PipelineService from "@/service/pipeline"
import Dropdown from "@/components/common/dropdown"
import Table from "@/components/common/table"
import { showConfirmModal } from "@/components/common/modal"
import KVTable from "@/components/common/kv_table"
import { getTaskIcon } from "@/components/common/tasks"
import { dateFormatFn } from "@/util"

const ShowPipeline = ({ pipelineId }) => {
  const [pipeline, setPipeline] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`Pipeline ${pipelineId}`)
  }, [pipelineId, setTitle])

  useEffect(() => {
    setLoading(true)
    PipelineService.fetch(pipelineId)
      .then(setPipeline, (err) => {
        if (err.response.status === 404) {
          setError("Pipeline not found")
        } else {
          setError("There was a problem retrieving the pipeline")
        }
      })
      .finally(() => setLoading(false))
  }, [pipelineId])

  const actionOptions = [
    {
      label: "Delete",
      onClick(id) {
        return showConfirmModal({
          body: `Are you sure you want to delete Pipeline ${id}?`,
        }).then((confirmed) => {
          if (confirmed) {
            PipelineService.delete(id).then(() => route("/pipelines"))
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

    const tasks = Object.keys(pipeline.tasks).map((k) => ({
      task_name: k,
      ...pipeline.tasks[k],
    }))

    const taskFn = (arr) => {
      if (!arr) {
        return ""
      }
      return arr.map((k, i) => {
        return (
          <Link
            className="text-blue-400 mr-1"
            key={i}
            href={`/tasks/${pipeline.tasks[k].ID}`}
          >
            {k}
          </Link>
        )
      })
    }

    return (
      <>
        <KVTable
          object={pipeline}
          keys={[
            "ID",
            "pipeline_name",
            "pipeline_owner_id",
            "created_time",
            "start_time",
            "end_time",
            "queue",
            "group",
            "chain",
            "chord",
          ]}
          formatters={{
            created_time: dateFormatFn,
            start_time: dateFormatFn,
            end_time: dateFormatFn,
            group: taskFn,
            chain: taskFn,
            chord: taskFn,
            pipeline_owner_id(id) {
              return (
                <Link href={`/users/${id}`} className="text-blue-400">
                  {id}
                </Link>
              )
            },
          }}
          fieldFormatters={{
            pipeline_owner_id: () => "Pipeline Owner",
          }}
        />
        <div className="text-xl font-bold mb-2">Tasks</div>
        <Table
          defaultSortBy={[{ id: "ID", desc: false }]}
          data={tasks}
          columns={[
            {
              id: "StatusIcon",
              Cell: ({ row }) => (
                <div className="text-center">
                  {getTaskIcon(row.original.status, row.original.result)}
                </div>
              ),
            },
            {
              Header: "ID",
              accessor: "ID",
              Cell: ({ row }) => {
                return (
                  <Link
                    href={`/tasks/${row.original.ID}`}
                    className="text-blue-400"
                  >
                    {row.original.ID}
                  </Link>
                )
              },
            },
            {
              Header: "Task Name",
              accessor: "task_name",
            },
            {
              Header: "Name",
              accessor: "name",
            },
            {
              Header: "Image",
              accessor: "image",
            },
            {
              Header: "Start Time",
              accessor: "start_time",
              Cell: ({ row }) => {
                return dateFormatFn(row.original.start_time)
              },
            },
            {
              Header: "Status",
              accessor: "status",
            },
          ]}
        />
      </>
    )
  })()

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl font-bold">Pipeline {pipelineId}</div>
        <div className="flex justify-between items-center">
          <Link href="/pipelines" className="text-sm mr-1">
            <FontAwesomeIcon icon="caret-left" className="mr-1" />
            back to all pipelines
          </Link>
          <Dropdown
            label={<FontAwesomeIcon icon="cog" />}
            anchor="right-0"
            options={actionOptions}
            actionArgs={[pipeline && pipeline.ID]}
          />
        </div>
      </div>
      {body}
    </>
  )
}

export default ShowPipeline
