import { useState, useEffect, useMemo } from "preact/hooks"

import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Spinner from "@/components/spinner"
import TaskService from "@/service/task"
import { showConfirmModal } from "@/components/common/modal"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshTasks = () => {
    setLoading(true)
    TaskService.fetchAll()
      .then(setTasks, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshTasks, [])

  const columns = useMemo(
    () => [
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
        accessor: "start_time",
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
              onClick() {},
            },
            {
              label: "Clone",
              onClick() {},
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
