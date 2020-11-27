import { useContext, useEffect } from "preact/hooks"

import TaskStats from "@/components/dashboard/task_stats"
import TitleContext from "@/contexts/title"

const Dashboard = () => {
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Dashboard")
  }, [])
  return (
    <div className="flex flex-col py-2">
      <TaskStats />
    </div>
  )
}
export default Dashboard
