import { Link } from "preact-router"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import { showConfirmModal } from "@/components/common/modal"
import TaskService from "@/service/task"
import UrlManager from "@/contexts/prefix"
import { datetimeFormatStr, durationFormatFn } from "@/util"
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

export const taskOptions = ({
  onClone = () => {},
  onDelete = () => {},
  //onStop = () => {},
}) => [
  /*
  {
    label: "Stop",
    onClick(id) {
      return showConfirmModal({
        body: `Are you sure you want to stop Task ${id}?`,
      }).then((confirmed) => {
        if (confirmed) {
          return TaskService.stop(id).then(() => onStop(id))
        }
      })
    },
  },
  */
  {
    label: "Clone",
    onClick(id) {
      TaskService.clone(id).then(({ id: newId }) => onClone(newId))
    },
  },
  {
    label: "Delete",
    onClick(id) {
      return showConfirmModal({
        body: `Are you sure you want to delete Task ${id}?`,
      }).then((confirmed) => {
        if (confirmed) {
          return TaskService.delete(id).then(() => onDelete(id))
        }
      })
    },
  },
]

export const taskTableColumns = ({
  fetchTasks = () => {},
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
        <Link href={UrlManager.buildUrl(`/tasks/${row.original.ID}`)} className="text-blue-400">
          {row.original.ID}
        </Link>
      )
    },
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ row }) => {
      return (
        <div className="max-w-sm">
          {row.original.name}
        </div>
      )
    },
  },
  {
    Header: "Image",
    accessor: "image",
  },
  {
    Header: "Status",
    accessor: "status",
    // todo: filter server-side
    // filter: "includes",
  },
  {
    Header: "Start Time",
    accessor: "start_time",
    Cell: ({ row }) => {
      if (row.original.start_time) {
        return dayjs(row.original.start_time).format(datetimeFormatStr)
      }
    },
  },
  {
    Header: "Creation Time",
    accessor: "created_time",
    Cell: ({ row }) => {
      if (row.original.created_time) {
        return dayjs(row.original.created_time).format(datetimeFormatStr)
      }
    },
  },
  {
    Header: "Duration",
    disableSortBy: true,
    accessor: (d) => {
      if (d.start_time) {
        let djsEndTime = d.end_time ? dayjs(d.end_time) : dayjs()
        return dayjs.duration(djsEndTime.diff(d.start_time)).asMilliseconds()
      }
    },
    Cell: ({ row }) => {
      if (row.original.start_time) {
        return durationFormatFn(row.original.start_time, row.original.end_time)
      }
    },
  },
  {
    id: "Actions",
    Cell: ({ row }) => {
      return (
        <Dropdown
          label="Actions"
          actionArgs={[row.original.ID]}
          options={taskOptions({
            onClone() {
              fetchTasks()
            },
            onDelete() {
              fetchTasks()
            },
            /*
            onStop(id) {
              TaskService.fetch(id).then((task) => {
                setTasks(
                  tasks.map((item) => {
                    return item.ID === id ? task : item
                  })
                )
              })
            },
            */
          })}
        />
      )
    },
  },
]
