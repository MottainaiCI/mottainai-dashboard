import { useState, useEffect, useContext, useRef, useMemo } from "preact/hooks"
import { route } from "preact-router"
import { Link } from "preact-router/match"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { Scrollbars } from "react-custom-scrollbars"

import TitleContext from "@/contexts/title"
import ThemeContext from "@/contexts/theme"
import UrlManager from "@/contexts/prefix"
import Button from "@/components/common/button"
import { PillLink } from "@/components/common/pill"
import Table from "@/components/common/table"
import KVTable from "@/components/common/kv_table"
import Loader from "@/components/common/loader"
import { getTaskIcon, taskOptions } from "@/components/common/tasks"
import Dropdown from "@/components/common/dropdown"
import TaskService from "@/service/task"
import themes from "@/themes"
import { durationFormatFn, nl2br, dateFormatFn } from "@/util"

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
              setError("There was a problem retrieving the task")
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
              href={UrlManager.buildUrl(`/public/artefact/${task.ID}/${row.original.ID}`)}
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

  let body = () => {
    if (error) {
      return <div>{error}</div>
    }

    const copyToClipboard = (cmd) => {
      if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = cmd;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
        return;
      }
      navigator.clipboard.writeText(cmd);
    }

    return (
      <>
        {task && (
          <div className="flex mb-2">
            <PillLink
              LinkTag="a"
              href={UrlManager.buildUrl(`/api/tasks/${task.ID}`)}
              target="_blank"
            >
              JSON
            </PillLink>
            <PillLink
              LinkTag="a"
              href={UrlManager.buildUrl(`/api/tasks/${task.ID}.yaml`)}
              target="_blank"
            >
              YAML
            </PillLink>
            <PillLink
              LinkTag="a"
              href={UrlManager.buildUrl(`/public/artefact/${task.ID}/build_${task.ID}.log`)}
              target="_blank"
              icon="file-alt"
            >
              Log
            </PillLink>
          </div>
        )}
        <KVTable
          object={task}
          keys={[
            "ID",
            "name",
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
            created_time: dateFormatFn,
            start_time: dateFormatFn,
            end_time: dateFormatFn,
            duration: () =>
              task.start_time
                ? durationFormatFn(task.start_time, task.end_time)
                : "",
            owner_id(id) {
              return (
                <Link href={UrlManager.buildUrl(`/users/${id}`)} className="text-blue-400">
                  {id}
                </Link>
              )
            },
            node_id(id) {
              return (
                <Link href={UrlManager.buildUrl(`/nodes/${id}`)} className="text-blue-400">
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

        <div className="text-xl font-bold my-2">Log Tail</div>
        <div
          className={`h-96 bg-white relative ${themes[theme].logs.container}`}
        >
          {isRefreshing && (
            <Button
              className={`absolute cursor-pointer top-0 right-0 rounded mr-3 mt-1 z-10
              ${themes[theme].logs[enableScroll ? "scrollOnBg" : "scrollOffBg"]
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
            ${themes[theme].logs.bg} ${themes[theme].consoleWrapper.container}`}
            >
              {nl2br(logs.trim())}
            </div>
          </Scrollbars>
        </div>
        <div className="text-xl font-bold my-2">Commands</div>
        <div className={`font-mono ${themes[theme].cardContainer} ${themes[theme].commandWrapper.container}`}>
          {task &&
            task.script &&
            task.script.map((cmd) => (
              <div className={`flex p-2 items-center cursor-pointer group ${themes[theme].commandWrapper.line}`} onClick={() => copyToClipboard(cmd)}>
                <div className="mr-2">{">"}</div>
                <div className="select-text text-sm">{cmd}</div>
                <FontAwesomeIcon icon="clipboard" className={`hidden ml-auto group-hover:inline`} />
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

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="m-px">
          <div className="text-2xl font-bold">
            Task {taskId} {task && getTaskIcon(task.status, task.result)}
          </div>
          <div className="m-px text-xl font-bold">
            {task.name}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link href={UrlManager.buildUrl('/tasks')} className="text-sm mr-1">
            <FontAwesomeIcon icon="caret-left" className="mr-1" />
            back to all tasks
          </Link>
          {task && (
            <Dropdown
              label={<FontAwesomeIcon icon="cog" />}
              anchor="right-0"
              actionArgs={[task && task.ID]}
              options={taskOptions({
                onClone(id) {
                  route(UrlManager.buildUrl(`/tasks/${id}`))
                },
                onDelete() {
                  route(UrlManager.buildUrl("/tasks"))
                },
              })}
            />
          )}
        </div>
      </div>
      {body()}
    </>
  )
}

export default ShowTask
