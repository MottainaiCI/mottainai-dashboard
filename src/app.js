import { Router, route, getCurrentUrl } from "preact-router"
import { useLocalStorage } from "@rehooks/local-storage"
import { useState } from "preact/hooks"
import { Helmet } from "react-helmet"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Dashboard from "@/components/routes/dashboard"
import Plans from "@/components/routes/plans"
import Pipelines from "@/components/routes/pipelines"
import ShowPipeline from "@/components/routes/pipelines/show"
import Tasks from "@/components/routes/tasks"
import ShowTask from "@/components/routes/tasks/show"
import NewTask from "@/components/routes/tasks/new"
import Nodes from "@/components/routes/nodes"
import ShowNode from "./components/routes/nodes/show"
import Artefacts from "@/components/routes/artefacts"
import ShowArtefacts from "./components/routes/artefacts/show"
import Login from "@/components/routes/login"
import Signup from "@/components/routes/signup"
import Tokens from "@/components/routes/tokens"
import Users from "@/components/routes/users"
import NewUser from "@/components/routes/users/new"
import EditUser from "@/components/routes/users/edit"
import ShowUser from "./components/routes/users/show"
import Integrations from "./components/routes/integrations"

import Sidebar from "@/components/sidebar"
import Loader from "@/components/common/loader"

import ThemeContext, { THEME_OPTIONS } from "@/contexts/theme"
import UserContext from "@/contexts/user"
import TitleContext from "@/contexts/title"
import AuthService from "@/service/auth"

import themes from "@/themes"
import axios from "@/axios"
import ShowPlan from "./components/routes/plans/show"

const AUTHED = [
  "/plans",
  "/pipelines",
  "/tasks",
  "/artefacts",
  "/nodes",
  "/users",
  "/tokens",
  "/integrations",
]
const UNAUTHED = ["/login", "/signup"]
const MANAGER_ROUTES = ["/users"]
const ADMIN_ROUTES = ["/tasks", "/nodes"]

const App = () => {
  const [theme, setTheme] = useLocalStorage(
    "mottainai-theme",
    THEME_OPTIONS[0].value
  )
  const themeValue = { theme, setTheme }
  const [user, setUserState] = useState(null)
  const setUser = (user) =>
    setUserState(
      user
        ? {
            ...user,
            is_admin: user.is_admin === "yes",
            is_manager: user.is_manager === "yes",
            identities: user.identities || {},
          }
        : user
    )
  const [loadingUser, setLoadingUser] = useState(true)
  const userVal = { user, setUser }
  const [title, setTitle] = useState("")
  const titleVal = { title, setTitle }

  if (!THEME_OPTIONS.some((t) => t.value === theme)) {
    setTheme(THEME_OPTIONS[0].value)
  }

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response.status == 403) {
        handleRoute(getCurrentUrl())
      }
      throw err
    }
  )

  const handleRoute = (url) => {
    if (loadingUser) {
      return
    }
    if (
      (AUTHED.some((val) => url.startsWith(val)) && !user) ||
      (UNAUTHED.some((val) => url.startsWith(val)) && user)
    ) {
      route("/")
    } else if (user) {
      if (
        MANAGER_ROUTES.some((val) => url.startsWith(val)) &&
        !user.is_manager &&
        !user.is_admin
      ) {
        route("/")
      }
      if (ADMIN_ROUTES.some((val) => url.startsWith(val)) && !user.is_admin) {
        route("/")
      }
    }
  }

  function clearLoadingUser() {
    handleRoute(getCurrentUrl())
    setLoadingUser(false)
  }

  useState(() => {
    if (AuthService.isLoggedIn()) {
      AuthService.getUser().then(setUser).finally(clearLoadingUser)
    } else {
      clearLoadingUser()
    }
  })

  if (loadingUser) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen w-full ${themes[theme].bg}`}
      >
        <Loader />
      </div>
    )
  }

  return (
    <UserContext.Provider value={userVal}>
      <ThemeContext.Provider value={themeValue}>
        <TitleContext.Provider value={titleVal}>
          <ToastContainer />
          <Helmet>
            <title>{`${title && `${title} - `}MottainaiCI`}</title>
          </Helmet>
          <div
            className={`flex h-screen ${themes[theme].bg} ${themes[theme].textColor}`}
          >
            <Sidebar />
            <div className="px-8 py-10 flex-1 overflow-auto">
              <Router onChange={(e) => handleRoute(e.url)}>
                <Dashboard path="/" />
                <Tasks path="/tasks" />
                <NewTask path="/tasks/new" />
                <ShowTask path={`/tasks/:taskId`} />
                <Plans path="/plans" />
                <ShowPlan path="/plans/:planId" />
                <Pipelines path="/pipelines" />
                <ShowPipeline path="/pipelines/:pipelineId" />
                <Nodes path="/nodes" />
                <ShowNode path="/nodes/:nodeId" />
                <Artefacts path="/artefacts" />
                <ShowArtefacts path="/artefacts/:namespace" />
                <Login path="/login" />
                <Signup path="/signup" />
                <Tokens path="/tokens" />
                <Users path="/users" />
                <NewUser path="/users/new" />
                <ShowUser path="/users/:userId" />
                <EditUser path="/users/:userId/edit" />
                <Integrations path="/integrations" />
              </Router>
            </div>
          </div>
        </TitleContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  )
}

export default App
