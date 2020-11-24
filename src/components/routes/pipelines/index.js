import { useState, useEffect, useMemo } from "preact/hooks"
import dayjs from "@/day"

import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Spinner from "@/components/spinner"
import PipelineService from "@/service/pipeline"
import { showConfirmModal } from "@/components/common/modal"

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refreshData = (setLoadingFlag = true) => {
    if (setLoadingFlag) {
      setLoading(true)
    }
    PipelineService.fetchAll()
      .then(setPipelines, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
      },
      {
        Header: "Name",
        accessor: "pipeline_name",
      },
      {
        Header: "Created",
        accessor: (d) => {
          if (d.created_time) {
            return dayjs(d.created_time).format("YYYY/MM/DD hh:mm:ss a")
          }
        },
      },
      {
        id: "Actions",
        Cell: ({ row }) => {
          const actionOptions = [
            {
              label: "Delete",
              onClick(row) {
                const onConfirm = () => {
                  PipelineService.delete(row.original.ID).then(() => {
                    setPipelines(
                      pipelines.filter((item) => item.ID !== row.original.ID)
                    )
                  })
                }

                showConfirmModal({
                  body: (
                    <p>
                      Are you sure you want to delete{" "}
                      <span className="font-bold">
                        {" "}
                        {row.original.pipeline_name}
                      </span>{" "}
                      ({row.original.ID})?
                    </p>
                  ),
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
    [pipelines]
  )

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Pipelines</p>
      {error ? (
        <div>There was a problem retrieving pipelines.</div>
      ) : pipelines.length ? (
        <Table data={pipelines} columns={columns} />
      ) : (
        <div>No pipelines were found.</div>
      )}
    </>
  )
}

export default Pipelines
