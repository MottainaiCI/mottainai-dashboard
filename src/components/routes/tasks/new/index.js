import { useEffect, useContext, useRef, useState } from "preact/hooks"
import { route } from "preact-router"
import Editor from "@monaco-editor/react"
import { Link } from "preact-router/match"
import { safeLoad } from "js-yaml"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import { toast } from "react-toastify"

import TitleContext from "@/contexts/title"
import UrlManager from "@/contexts/prefix"
import Button from "@/components/common/button"
import { planYmlSnippet } from "@/snippets/plan"
import TaskService from "@/service/task"
import Loader from "@/components/common/loader"

const NewTask = () => {
  const [isEditorReady, setIsEditorReady] = useState(false)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("New Task")
  }, [setTitle])

  const editorRef = useRef()
  function handleEditorDidMount(editor) {
    editorRef.current = editor
    setIsEditorReady(true)
  }

  function create() {
    let taskContent
    try {
      taskContent = safeLoad(editorRef.current.getValue())
    } catch (e) {
      toast.error("Please enter valid YAML")
      return
    }

    if (typeof taskContent !== "object" || Array.isArray(taskContent)) {
      toast.error("Plase enter a YAML object")
      return
    }

    TaskService.create(taskContent).then(
      (task) => route(UrlManager.buildUrl(`/tasks/${task.id}`)),
      (e) => {
        toast.error(`Could not create task: ${e.response.data}`)
      }
    )
  }

  function goBack() {
    route(UrlManager.buildUrl("/tasks"))
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl font-bold">New Task</div>
        <Link href={UrlManager.buildUrl('/tasks')} className="text-sm">
          <FontAwesomeIcon icon="caret-left" className="mr-1" />
          back to all tasks
        </Link>
      </div>
      <Editor
        height="30rem"
        language="yaml"
        value={planYmlSnippet}
        loading={<Loader />}
        onMount={handleEditorDidMount}
        options={{ theme: "dark", minimap: { enabled: false }, scrollbar: {} }}
      />
      <div className="flex flex-row justify-between">
        <Button className="mt-2" onClick={goBack}>
          Cancel
        </Button>
        <Button className="mt-2" onClick={create} disabled={!isEditorReady}>
          Create
        </Button>
      </div>
    </>
  )
}

export default NewTask
