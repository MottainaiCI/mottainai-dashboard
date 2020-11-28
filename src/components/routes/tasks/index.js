import { useState, useEffect, useMemo, useContext } from "preact/hooks"
import { Link } from "preact-router/match"
import dayjs from "@/day"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Loader from "@/components/common/loader"
import TaskService from "@/service/task"
import { getTaskIcon, taskOptions } from "@/components/common/tasks"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Tasks")
  }, [])

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
    ],
    [tasks]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Tasks</p>
      {error ? (
        <div>There was a problem retrieving tasks.</div>
      ) : tasks.length ? (
        <Table data={tasks} columns={columns} />
      ) : (
        <div>No tasks were found.</div>
      )}
    </>
  )
}

export default Tasks
