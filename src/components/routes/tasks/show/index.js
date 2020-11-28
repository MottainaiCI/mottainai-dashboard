import { useState, useEffect, useContext, useMemo } from "preact/hooks"
import { Link } from "preact-router/match"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import TitleContext from "@/contexts/title"
import Loader from "@/components/common/loader"
import { getTaskIcon, taskOptions } from "@/components/common/tasks"
import Dropdown from "@/components/common/dropdown"
import TaskService from "@/service/task"

const ShowTask = ({ taskId }) => {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`Task ${taskId}`)
  }, [])

  const refreshTasks = (setLoadingFlag = true) => {
    if (setLoadingFlag) {
      setLoading(true)
    }
    TaskService.fetch(taskId)
      .then(setTask, setError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refreshTasks()

    const intId = setInterval(() => {
      refreshTasks(false)
    }, 30 * 1000)

    return () => clearInterval(intId)
  }, [taskId])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          Task {taskId} {getTaskIcon(task.status, task.result)}
        </div>
        <div>
          <Dropdown
            label={<FontAwesomeIcon icon="cog" />}
            anchor="right"
            options={taskOptions}
            actionArgs={[task.ID]}
          />
        </div>
      </div>
      <div className="mb-2">
        <Link href="/tasks" className="text-sm">
          <FontAwesomeIcon icon="caret-left" className="mr-1" />
          back to all tasks
        </Link>
      </div>
      {error ? <div>There was a problem retrieving the task.</div> : task.ID}
    </>
  )
}

export default ShowTask
