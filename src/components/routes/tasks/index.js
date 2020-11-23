import axios from "@/axios"
import { useState, useEffect, useMemo, useRef } from "preact/hooks"
import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Spinner from "@/components/spinner"
import { ConfirmModal } from "@/components/common/modal"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalText, setModalText] = useState(false)
  useEffect(() => {
    axios
      .get("/tasks")
      .then(
        ({ data }) => {
          setTasks(data)
        },
        (error) => {
          // setError(error)
        }
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Spinner />
  }

  let modalConfirmFn = useRef(() => {})
  const onModalConfirm = () => modalConfirmFn.current.call(this)

  const actionOptions = useMemo(
    () => [
      {
        label: "Start",
        onClick(row) {},
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
          setModalText(
            `Are you sure you want to delete Task ${row.original.ID}?`
          )
          setModalOpen(true)
          modalConfirmFn.current = () => {
            setModalOpen(false)
            // axios
            //   .get("/tasks")
            //   .then(
            //     ({ data }) => {
            //       setTasks(data)
            //       setTasks(data.filter((item) => item.ID !== row.original.ID))
            //     },
            //     (error) => {
            //       // setError(error)
            //     }
            //   )
            //   .finally(() => setLoading(false))
          }
        },
      },
    ],
    []
  )

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
    []
  )

  return (
    <>
      <p className="text-2xl font-bold mb-2">Tasks</p>
      <ConfirmModal
        isOpen={modalOpen}
        body={modalText}
        onCancel={() => setModalOpen(false)}
        onConfirm={onModalConfirm}
      />
      {tasks.length ? (
        <Table data={tasks} columns={columns} />
      ) : (
        <div>No tasks were found.</div>
      )}
    </>
  )
}

export default Tasks
