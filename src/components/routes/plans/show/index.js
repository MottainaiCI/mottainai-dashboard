import { Link, route } from "preact-router"
import { useContext, useEffect, useState } from "preact/hooks"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import TitleContext from "@/contexts/title"
import ThemeContext from "@/contexts/theme"
import UrlManager from "@/contexts/prefix"
import Loader from "@/components/common/loader"
import Pill from "@/components/common/pill"
import Dropdown from "@/components/common/dropdown"
import { showConfirmModal } from "@/components/common/modal"
import PlanService from "@/service/plan"
import dayjs from "@/day"
import themes from "@/themes"
import { datetimeFormatStr } from "@/util"

const ShowPlan = ({ planId }) => {
  let { theme } = useContext(ThemeContext)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`Plan ${planId}`)
  }, [planId, setTitle])

  useEffect(() => {
    PlanService.fetch(planId)
      .then(setPlan, (err) => {
        if (err.response.status === 404) {
          setError("Plan not found.")
        } else {
          setError("There was a problem fetching the plan.")
        }
      })
      .finally(() => setLoading(false))
  }, [planId])

  const actionOptions = [
    {
      id: "delete",
      label: "Delete",
      onClick(id) {
        return showConfirmModal({
          body: `Are you sure you want to delete Plan ${id}?`,
        }).then((confirmed) => {
          if (confirmed) {
            PlanService.delete(id).then(() => route(UrlManager.buildUrl("/plans")))
          }
        })
      },
    },
  ]

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Plan {planId}</div>
        <div className="flex justify-between items-center">
          <Link href={UrlManager.buildUrl('/plans')} className="text-sm mr-1">
            <FontAwesomeIcon icon="caret-left" className="mr-1" />
            back to all plans
          </Link>
          <Dropdown
            label={<FontAwesomeIcon icon="cog" />}
            anchor="right-0"
            options={actionOptions}
            actionArgs={[plan && plan.ID]}
          />
        </div>
      </div>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="font-bold mb-2">{plan.name}</div>
          <div className="flex mb-2">
            <Pill>{plan.planned}</Pill>
            <Pill>{plan.image}</Pill>
            <Pill>
              Created: {dayjs(plan.created_time).format(datetimeFormatStr)}
            </Pill>
          </div>
          <div className="text-lg font-bold my-2">Script</div>
          <div className={`font-mono p-2 ${themes[theme].cardContainer}`}>
            {plan &&
              plan.script &&
              plan.script.map((cmd) => (
                <div className="flex items-center">
                  <div className="mr-2">{">"}</div>
                  <div className="select-text">{cmd}</div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  )
}

export default ShowPlan
