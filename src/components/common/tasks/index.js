import { Link } from "preact-router"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import { showConfirmModal } from "@/components/common/modal"
import TaskService from "@/service/task"
import { datetimeFormatStr, durationFormat } from "@/util"
import dayjs from "@/day"
import Dropdown from "../dropdown"

export const getTaskIcon = (status, result) => {
  switch (status) {
    case "done":
      switch (result) {
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

export const taskOptions = [
  {
    id: "start",
    label: "Start",
    onClick(id) {
      return TaskService.start(id)
    },
  },
  {
    id: "stop",
    label: "Stop",
    onClick(id) {
      return showConfirmModal({
        body: `Are you sure you want to stop Task ${id}?`,
      }).then(() => {
        return TaskService.stop(id)
      })
    },
  },
  {
    id: "clone",
    label: "Clone",
    onClick(id) {
      return TaskService.clone(id)
    },
  },
  {
    id: "delete",
    label: "Delete",
    onClick(id) {
      return showConfirmModal({
        body: `Are you sure you want to delete Task ${id}?`,
      }).then(() => {
        return TaskService.delete(id)
      })
    },
  },
]

export const taskTableColumns = ({
  refreshTasks = () => {},
  setTasks = () => {},
  tasks = [],
}) => [
  {
    id: "StatusIcon",
    Cell: ({ row }) => {
      return (
        <div className="text-center">
          {getTaskIcon(row.original.status, row.original.result)}
        </div>
      )
    },
  },
  {
    Header: "ID",
    accessor: "ID",
    Cell: ({ row }) => {
      return (
        <Link href={`/tasks/${row.original.ID}`} className="text-blue-400">
          {row.original.ID}
        </Link>
      )
    },
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
        return dayjs(d.start_time).format(datetimeFormatStr)
      }
    },
  },
  {
    Header: "Duration",
    accessor: (d) => {
      if (d.start_time) {
        return durationFormat(d.start_time, d.end_time)
      }
    },
  },
  {
    id: "Actions",
    Cell: ({ row }) => {
      return (
        <Dropdown
          label="Actions"
          options={taskOptions}
          actionArgs={[row.original.ID]}
          dropdownOnClick={{
            clone(promise) {
              promise.then(refreshTasks)
            },
            delete(promise) {
              promise.then(() => {
                let id = row.original.ID
                promise.then(() => {
                  setTasks(tasks.filter((item) => item.ID !== id))
                })
              })
            },
            stop(promise) {
              promise.then(() => {
                let id = row.original.ID
                TaskService.fetch(id).then((task) => {
                  setTasks(
                    tasks.map((item) => {
                      return item.ID === id ? task : item
                    })
                  )
                })
              })
            },
            start(promise) {
              promise.then(() => {
                let id = row.original.ID
                TaskService.fetch(id).then((task) => {
                  setTasks(
                    tasks.map((item) => {
                      return item.ID === id ? task : item
                    })
                  )
                })
              })
            },
          }}
        />
      )
    },
  },
]
