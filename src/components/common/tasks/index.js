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
    label: "Start",
    onClick(id) {
      TaskService.start(id).then(() => {
        TaskService.fetch(id).then((task) => {
          setTasks(
            tasks.map((item) => {
              return item.ID === id ? task : item
            })
          )
        })
      })
    },
  },
  {
    label: "Stop",
    onClick(id) {
      TaskService.stop(id).then(() => {
        TaskService.fetch(id).then((task) => {
          setTasks(
            tasks.map((item) => {
              return item.ID === id ? task : item
            })
          )
        })
      })
    },
  },
  {
    label: "Clone",
    onClick(id) {
      TaskService.clone(id).then(refreshTasks)
    },
  },
  {
    label: "Delete",
    onClick(id) {
      const onConfirm = () => {
        TaskService.delete(id).then(() => {
          setTasks(tasks.filter((item) => item.ID !== id))
        })
      }

      showConfirmModal({
        body: `Are you sure you want to delete Task ${id}?`,
        onConfirm,
      })
    },
  },
]
