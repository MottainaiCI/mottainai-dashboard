import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import { showConfirmModal } from "@/components/common/modal"
import TaskService from "@/service/task"

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
