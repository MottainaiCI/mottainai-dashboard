import DashboardCard from "./card"
import { useEffect, useState } from "preact/hooks"
import axios from "@/axios"

const Stat = ({ label, num, className }) => (
  <div className={`text-center mx-5 ${className}`}>
    <div className="text-3xl font-medium">{num || 0}</div>
    <div className="text-md">{label}</div>
  </div>
)

const TaskStatCard = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("/v1/client/dashboard/stats").then(
      ({ data }) => {
        setStats(data)
        setLoading(false)
      },
      (error) => {
        setError(error)
      }
    )
  }, [])

  return (
    <DashboardCard title="Task Stats" loading={loading} error={error}>
      <div className="grid grid-cols-5 gap-4">
        <Stat label="Total" num={stats.total} />
        <Stat label="Running" num={stats.status?.running} />
        <Stat label="Waiting" num={stats.status?.waiting} />
        <Stat label="Stopped" num={stats.status?.stopped} />
        <Stat label="Stopping" num={stats.status?.stopping} />
        <Stat
          className="col-start-2"
          label="Succeeded"
          num={stats.result?.success}
        />
        <Stat label="Errored" num={stats.result?.error} />
        <Stat label="Failed" num={stats.result?.failed} />
      </div>
    </DashboardCard>
  )
}

export default TaskStatCard
