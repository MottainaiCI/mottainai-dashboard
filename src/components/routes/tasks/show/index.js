import { useState, useEffect, useContext, useRef, useMemo } from "preact/hooks"
import { route } from "preact-router"
import { Link } from "preact-router/match"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { Scrollbars } from "react-custom-scrollbars"

import TitleContext from "@/contexts/title"
import ThemeContext from "@/contexts/theme"
import Button from "@/components/common/button"
import { PillLink } from "@/components/common/pill"
import Table from "@/components/common/table"
import KVTable from "@/components/common/kv_table"
import Loader from "@/components/common/loader"
import { getTaskIcon, taskOptions } from "@/components/common/tasks"
import Dropdown from "@/components/common/dropdown"
import TaskService from "@/service/task"
import themes from "@/themes"
import { datetimeFormatStr, durationFormat, nl2br } from "@/util"
import dayjs from "@/day"

const ShowTask = ({ taskId }) => {
  const logView = useRef()
  const [enableScroll, setEnableScroll] = useState(true)
  const [task, setTask] = useState(null)
  const [logs, setLogs] = useState("")
  const [artefacts, setArtefacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(true)

  let { theme } = useContext(ThemeContext)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle(`Task ${taskId}`)
    setEnableScroll(true)
    setTask(null)
    setLogs("")
    setArtefacts([])
    setLoading(true)
    setError(false)
    setIsRefreshing(true)
  }, [setTitle, taskId])

  useEffect(() => {
    if (!isRefreshing) {
      return
    }
    let timeoutId = null
    const refreshTask = () => {
      TaskService.fetch(taskId)
        .then(
          (task) => {
            setTask(task)
            if (task && task.status !== "done") {
              timeoutId = setTimeout(refreshTask, 1000)
              setIsRefreshing(true)
            } else {
              setIsRefreshing(false)
            }
          },
          (err) => {
            if (err.response.status === 404) {
              setError("Task not found.")
            } else {
              setError(err)
            }
          }
        )
        .finally(() => {
          setLoading(false)
        })

      TaskService.tailOutput(taskId)
        .then(setLogs)
        .then(() => {
          if (enableScroll && logView.current) {
            logView.current.scrollToBottom()
          }
        })

      TaskService.artefacts(taskId)
        .then(
          (artefacts) => artefacts && artefacts.map((name) => ({ ID: name }))
        )
        .then(setArtefacts)
    }
    refreshTask()

    return () => clearTimeout(timeoutId)
  }, [taskId, enableScroll, isRefreshing])

  const artefactColumns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "ID",
        Cell: ({ row }) => {
          return (
            <a
              href={`/public/artefact/${task.ID}/${row.original.ID}`}
              className="text-blue-400"
              target="_blank"
              rel="noreferrer"
            >
              {row.original.ID}
            </a>
          )
        },
      },
    ],
    [task]
  )

  if (loading) {
    return <Loader />
  }

  const dateFn = (val) => (val ? dayjs(val).format(datetimeFormatStr) : "N/A")

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          Task {taskId} {task && getTaskIcon(task.status, task.result)}
        </div>
        <div className="flex justify-between items-center">
          <Link href="/tasks" className="text-sm mr-1">
            <FontAwesomeIcon icon="caret-left" className="mr-1" />
            back to all tasks
          </Link>
          <Dropdown
            label={<FontAwesomeIcon icon="cog" />}
            anchor="right-0"
            actionArgs={[task && task.ID]}
            options={taskOptions({
              onClone(id) {
                route(`/tasks/${id}`)
              },
              onDelete() {
                route("/tasks")
              },
            })}
          />
        </div>
      </div>
      <div className="font-bold mb-2">
        <div className="text-base">{task.name}</div>
      </div>
      <div className="flex mb-2">
        <PillLink LinkTag="a" href={`/api/tasks/${task.ID}`} target="_blank">
          JSON
        </PillLink>
        <PillLink
          LinkTag="a"
          href={`/api/tasks/${task.ID}.yaml`}
          target="_blank"
        >
          YAML
        </PillLink>
      </div>
      <KVTable
        object={task}
        keys={[
          "ID",
          "type",
          "image",
          "owner_id",
          "node_id",
          "created_time",
          "start_time",
          "end_time",
          "duration",
        ]}
        formatters={{
          created_time: dateFn,
          start_time: dateFn,
          end_time: dateFn,
          duration: () =>
            task.start_time
              ? durationFormat(task.start_time, task.end_time)
              : "",
          owner_id(id) {
            return (
              <Link href={`/users/${id}`} className="text-blue-400">
                {id}
              </Link>
            )
          },
          node_id(id) {
            return (
              <Link href={`/nodes/${id}`} className="text-blue-400">
                {id}
              </Link>
            )
          },
        }}
        fieldFormatters={{
          owner_id: () => "Owner",
          node_id: () => "Node",
        }}
      />

      {error && (
        <div className="w-full bg-red-200 px-2 py-1">
          {typeof error === "string"
            ? error
            : "There was a problem retrieving the task."}
        </div>
      )}
      <div className="text-xl font-bold my-2">Log Tail</div>
      <div className={`h-96 bg-white relative ${themes[theme].logs.container}`}>
        {isRefreshing && (
          <Button
            className={`absolute cursor-pointer top-0 right-0 rounded mr-3 mt-1 z-10
              ${
                themes[theme].logs[enableScroll ? "scrollOnBg" : "scrollOffBg"]
              }`}
            onClick={() => {
              setEnableScroll(!enableScroll)
            }}
          >
            Scroll {enableScroll ? "On" : "Off"}
          </Button>
        )}
        <Scrollbars
          renderTrackVertical={({ style }) => (
            <div
              style={{
                ...style,
                right: 2,
                bottom: 2,
                top: 2,
                borderRadius: 3,
              }}
              className={themes[theme].logs.scrollTrack}
            />
          )}
          renderThumbVertical={({ style }) => (
            <div
              style={{
                ...style,
                borderRadius: "inherit",
              }}
              className={themes[theme].logs.scrollThumb}
            />
          )}
          ref={logView}
        >
          <div
            className={`pl-2 py-1 select-text font-mono
            ${themes[theme].logs.bg}`}
          >
            {nl2br(logs.trim())}
          </div>
        </Scrollbars>
      </div>
      <div className="text-xl font-bold my-2">Commands</div>
      <div className={`font-mono p-2 ${themes[theme].cardContainer}`}>
        {task &&
          task.script &&
          task.script.map((cmd) => (
            <div className="flex items-center">
              <div className="mr-2">{">"}</div>
              <div className="select-text">{cmd}</div>
            </div>
          ))}
      </div>
      <div className="text-xl font-bold my-2">Artefacts</div>
      {artefacts ? (
        <Table data={artefacts} columns={artefactColumns} />
      ) : (
        <div>No artefacts found.</div>
      )}
    </>
  )
}

export default ShowTask
