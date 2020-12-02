import { route } from "preact-router"
import { useContext } from "preact/hooks"
import { useLocalStorage } from "@rehooks/local-storage"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import ThemeContext, { THEME_OPTIONS } from "@/contexts/theme"
import UserContext from "@/contexts/user"
import SidebarContext from "@/contexts/sidebar"
import themes from "@/themes"
import UserService from "@/service/user"
import logo from "@/assets/images/logo.png"

import { SidebarLink } from "./common"
import {
  SidebarPopoutSelector,
  SidebarPopoutMenu,
  SidebarPopoutItem,
  SidebarPopoutLink,
} from "./popout"

const ProfileItem = () => {
  let { user, setUser } = useContext(UserContext)
  const signOut = () => {
    UserService.logout().then(() => {
      setUser(null)
      route("/")
    })
  }

  return (
    <SidebarPopoutMenu icon="user" anchor="bottom-0" label={user.name}>
      <SidebarPopoutLink href="/users" icon="users" text="Users" />
      <SidebarPopoutLink href="/tokens" icon="key" text="API Tokens" />
      <SidebarPopoutItem onClick={signOut} icon="sign-out-alt" text="Log out" />
    </SidebarPopoutMenu>
  )
}

const Sidebar = () => {
  let { theme, setTheme } = useContext(ThemeContext)
  let { user } = useContext(UserContext)
  const [collapsed, setCollapsed] = useLocalStorage(
    "mottainai-sidebar-collapsed",
    false
  )
  const sidebarContextValue = { collapsed, setCollapsed }

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <div
        className={`${
          collapsed ? "w-16" : "w-60"
        } flex-none flex flex-col transition-width duration-200 ease-linear`}
      >
        <div
          className={`flex-1 flex flex-col ${themes[theme].sidebar.bg} ${themes[theme].sidebar.bg}`}
        >
          <div
            className="text-right mr-2 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FontAwesomeIcon
              icon={`${collapsed ? "caret-right" : "caret-left"}`}
            />
          </div>
          <div className="flex flex-row justify-center items-center py-4">
            <img src={logo} className={`w-10 ${!collapsed && "mr-2"}`} />
            {!collapsed && (
              <div className="text-2xl font-medium">MottainaiCI</div>
            )}
          </div>
          <div className="border h-px w-4/5 mx-auto mb-4" />
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col">
              <SidebarLink href="/" icon="tachometer-alt" text="Dashboard" />
              {user && (
                <>
                  <SidebarLink href="/tasks" icon="tasks" text="Tasks" />
                  <SidebarLink href="/plans" icon="clock" text="Plans" />
                  <SidebarLink
                    href="/pipelines"
                    icon="code-branch"
                    text="Pipelines"
                  />
                  <SidebarLink
                    href="/nodes"
                    icon="network-wired"
                    text="Nodes"
                  />
                  <SidebarLink
                    href="/artefacts"
                    icon="cloud"
                    text="Artefacts"
                  />
                </>
              )}
            </div>

            <div className="flex flex-col">
              {user ? (
                <ProfileItem />
              ) : (
                <SidebarLink href="/login" icon="user" text="Log In" />
              )}
              <SidebarPopoutSelector
                icon="palette"
                anchor="bottom-0"
                label="Theme"
                options={THEME_OPTIONS}
                onSelect={setTheme}
                selected={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

export default Sidebar
