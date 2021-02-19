import {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "preact/hooks"
import { route } from "preact-router"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table/async"
import TaskService from "@/service/task"
import { taskTableColumns } from "@/components/common/tasks"
import Button from "@/components/common/button"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const fetchIdRef = useRef(0)
  const fetchArgs = useRef({})
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Tasks")
  }, [setTitle])

  const fetchTasks = useCallback((args) => {
    const fetchId = ++fetchIdRef.current
    if (args) {
      fetchArgs.current = args
    }
    const { pageIndex, pageSize, sortBy } = fetchArgs.current

    let sort, sortOrder
    if (sortBy.length) {
      sort = sortBy[0].id
      sortOrder = sortBy[0].desc ? "DESC" : "ASC"
    }

    setLoading(true)
    TaskService.fetchPage({ pageIndex, pageSize, sort, sortOrder })
      .then((data) => {
        if (fetchId === fetchIdRef.current) {
          setTasks(data.tasks)
          setTotal(data.total)
          setPageCount(Math.ceil(data.total / pageSize))
        }
      }, setError)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl font-bold mb-2">Tasks</p>
        <div>
          <Button onClick={() => route("/tasks/new")}>New Task</Button>
        </div>
      </div>
      {error ? (
        <div>There was a problem retrieving tasks.</div>
      ) : (
        <Table
          loading={loading}
          fetchData={fetchTasks}
          pageCount={pageCount}
          data={tasks}
          total={total}
          columns={taskTableColumns({
            fetchTasks,
            setTasks,
            tasks,
          })}
        />
      )}
    </>
  )
}

export default Tasks
