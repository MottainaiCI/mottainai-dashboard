import { useState, useEffect, useMemo } from "preact/hooks"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(duration)
dayjs.extend(relativeTime)

import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Spinner from "@/components/spinner"
import TaskService from "@/service/task"
import { showConfirmModal } from "@/components/common/modal"

const getIcon = (row) => {
  switch (row.original.status) {
    case "done":
      switch (row.original.result) {
        case "error":
        case "failed":
          return <FontAwesomeIcon icon="exclamation" className="text-red-500" />
        case "success":
          return <FontAwesomeIcon icon="check" className="text-green-500" />
        default:
          return <FontAwesomeIcon icon="question" />
      }
    case "stop":
      return (
        <FontAwesomeIcon
          icon="stop"
          className="text-red-300 faa-flash animated"
        />
      )
    case "stopped":
      return <FontAwesomeIcon icon="stop" className="text-red-300" />
    case "waiting":
      return <FontAwesomeIcon icon="clock" className="text-yellow-400" />
    case "running":
      return (
        <FontAwesomeIcon icon="spinner" className="text-blue-400 fa-pulse" />
      )
    default:
      return <FontAwesomeIcon icon="question" />
  }
}

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshTasks = (setLoadingFlag = true) => {
    if (setLoadingFlag) {
      setLoading(true)
    }
    TaskService.fetchAll()
      .then(setTasks, setError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refreshTasks()

    const intId = setInterval(() => {
      refreshTasks(false)
    }, 30 * 1000)

    return () => clearInterval(intId)
  }, [])

  const columns = useMemo(
    () => [
      {
        id: "StatusIcon",
        Cell: ({ row }) => {
          return <div className="text-center">{getIcon(row)}</div>
        },
      },
      {
        Header: "ID",
        accessor: "ID",
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
        accessor: (d) => {
          if (d.start_time) {
            return dayjs(d.start_time).format("YYYY/MM/DD hh:mm:ss a")
          }
        },
      },
      {
        Header: "Duration",
        accessor: (d) => {
          if (d.start_time) {
            let endTime = d.end_time ? dayjs(d.end_time) : dayjs()
            return dayjs.duration(endTime.diff(d.start_time), "ms").humanize()
          }
        },
      },
      {
        id: "Actions",
        Cell: ({ row }) => {
          const actionOptions = [
            {
              label: "Start",
              onClick() {},
            },
            {
              label: "Stop",
              onClick(row) {
                TaskService.delete(row.original.ID).then(() => {
                  setTasks(
                    tasks.map((item) => {
                      if (item.ID !== row.original.ID) {
                        return item
                      } else {
                        item.original.status = "stop"
                      }
                    })
                  )
                })
              },
            },
            {
              label: "Clone",
              onClick(row) {
                TaskService.clone(row.original.ID).then(refreshTasks)
              },
            },
            {
              label: "Delete",
              onClick(row) {
                const onConfirm = () => {
                  TaskService.delete(row.original.ID).then(() => {
                    setTasks(
                      tasks.filter((item) => item.ID !== row.original.ID)
                    )
                  })
                }

                showConfirmModal({
                  body: `Are you sure you want to delete Task ${row.original.ID}?`,
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
    [tasks]
  )

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Tasks</p>
      {error ? (
        <div>There was a problem retrieving tasks</div>
      ) : tasks.length ? (
        <Table data={tasks} columns={columns} />
      ) : (
        <div>No tasks were found.</div>
      )}
    </>
  )
}

export default Tasks
