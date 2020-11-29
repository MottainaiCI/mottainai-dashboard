import { useState, useEffect, useContext } from "preact/hooks"
import { route } from "preact-router"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import Loader from "@/components/common/loader"
import TaskService from "@/service/task"
import { taskTableColumns } from "@/components/common/tasks"
import Button from "@/components/common/button"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Tasks")
  }, [setTitle])

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

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold mb-2">Tasks</p>
        <div className="mb-2">
          <Button onClick={() => route("/tasks/new")}>New Task</Button>
        </div>
      </div>
      {error ? (
        <div>There was a problem retrieving tasks.</div>
      ) : tasks.length ? (
        <Table
          data={tasks}
          columns={taskTableColumns({
            refreshTasks,
            setTasks,
            tasks,
          })}
        />
      ) : (
        <div>No tasks were found.</div>
      )}
    </>
  )
}

export default Tasks
