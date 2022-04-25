import { route } from "preact-router"
import { useContext } from "preact/hooks"
import { useLocalStorage } from "@rehooks/local-storage"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"

import ThemeContext, { THEME_OPTIONS } from "@/contexts/theme"
import UserContext from "@/contexts/user"
import SidebarContext from "@/contexts/sidebar"
import UrlManager from "@/contexts/prefix"
import themes from "@/themes"
import AuthService from "@/service/auth"
import logo from "@/assets/images/logo.png"

import { SidebarLink } from "./common"
import {
  SidebarPopoutSelector,
  SidebarPopoutMenu,
  SidebarPopoutItem,
  SidebarPopoutLink,
} from "./popout"

const LoginItem = () => {
  const withSignup = process.env.SIGNUP_ENABLE == "true" ? true : false

  return (
    <div>
      <SidebarLink href={ UrlManager.buildUrl('/login') } icon="sign-in-alt" text="Log In" />
      {withSignup && (
        <SidebarLink href={ UrlManager.buildUrl('/signup') } icon="user-plus" text="Sign Up" />
      )}
    </div>
  )
}

const ProfileItem = () => {
  let { user, setUser } = useContext(UserContext)
  const isPrivileged = user.is_manager || user.is_admin
  const signOut = () => {
    AuthService.logout().then(() => {
      setUser(null)
      route(UrlManager.buildUrl("/"))
    })
  }

  return (
    <SidebarPopoutMenu icon="user" anchor="bottom-0" label={user.name}>
      <SidebarPopoutItem onClick={signOut} icon="sign-out-alt" text="Log out" />
      {isPrivileged && (
        <SidebarPopoutLink href={ UrlManager.buildUrl('/users') } icon="users" text="Users" />
      )}
      <SidebarPopoutLink href={ UrlManager.buildUrl('/tokens') } icon="key" text="API Tokens" />
      <SidebarPopoutLink
        href={UrlManager.buildUrl('/integrations')}
        icon="share-alt"
        text="Integrations"
      />
    </SidebarPopoutMenu>
  )
}

const Sidebar = () => {
  let { theme, setTheme } = useContext(ThemeContext)
  let { user: currentUser } = useContext(UserContext)
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
              <SidebarLink href={UrlManager.buildUrl('/')} icon="tachometer-alt" text="Dashboard" />
              {currentUser && (
                <>
                  <SidebarLink href={UrlManager.buildUrl('/tasks')} icon="tasks" text="Tasks" />
                  <SidebarLink
                    href={UrlManager.buildUrl('/pipelines')}
                    icon="code-branch"
                    text="Pipelines"
                  />
                </>
              )}
              {currentUser && (
                <>
                  {currentUser.is_admin && (
                    <>
                      <SidebarLink href={UrlManager.buildUrl('/plans')} icon="clock" text="Plans" />
                      <SidebarLink
                        href={UrlManager.buildUrl('/nodes')}
                        icon="network-wired"
                        text="Nodes"
                      />
                    </>
                  )}
                  <SidebarLink
                    href={UrlManager.buildUrl('/artefacts')}
                    icon="cloud"
                    text="Artefacts"
                  />
                </>
              )}
            </div>

            <div className="flex flex-col">
              {currentUser ? (
                <ProfileItem />
              ) : (
                <>
                  <LoginItem />
                </>
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
