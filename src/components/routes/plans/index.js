import { useState, useEffect, useMemo, useContext } from "preact/hooks"

import TitleContext from "@/contexts/title"
import Table from "@/components/common/table"
import Dropdown from "@/components/common/dropdown"
import Loader from "@/components/common/loader"
import PlanService from "@/service/plan"
import { showConfirmModal } from "@/components/common/modal"
import { Link } from "preact-router"

const Plans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Plans")
  }, [setTitle])

  const refreshData = (setLoadingFlag = true) => {
    if (setLoadingFlag) {
      setLoading(true)
    }
    PlanService.fetchAll()
      .then(setPlans, setError)
      .finally(() => setLoading(false))
  }

  useEffect(refreshData, [])

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({ row }) => {
          return (
            <Link href={`/plans/${row.original.ID}`} className="text-blue-400">
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
        Header: "Schedule",
        accessor: "planned",
      },
      {
        id: "Actions",
        Cell: ({ row }) => {
          const actionOptions = [
            {
              label: "Delete",
              onClick(row) {
                showConfirmModal({
                  body: `Are you sure you want to delete Plan ${row.original.ID}?`,
                }).then((confirmed) => {
                  if (confirmed) {
                    PlanService.delete(row.original.ID).then(() => {
                      setPlans(
                        plans.filter((item) => item.ID !== row.original.ID)
                      )
                    })
                  }
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
    [plans]
  )

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Plans</p>
      {error ? (
        <div>There was a problem retrieving plans.</div>
      ) : plans.length ? (
        <Table data={plans} columns={columns} />
      ) : (
        <div>No plans were found.</div>
      )}
    </>
  )
}

export default Plans
