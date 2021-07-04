import { useState, useEffect, useContext } from "preact/hooks"

import TitleContext from "@/contexts/title"
import UserContext from "@/contexts/user"
import { FontAwesomeIcon } from "@aduh95/preact-fontawesome"
import UserService from "@/service/user"

const AVAILABLE_INTEGRATIONS = ["github"]
const INT_ICON = {
  github: ["fab", "github"],
}
const INT_LABEL = {
  github: "GitHub",
}
const INT_LOGOUT = {
  github: () => {
    UserService.ghLogout().then(() => {
      window.location.href = "/integrations"
    })
  },
}

function popupWindow(url, windowName, win, w, h) {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2
  return win.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  )
}

const Integrations = () => {
  let [popup, setPopup] = useState(null)
  let { user: currentUser } = useContext(UserContext)
  let { setTitle } = useContext(TitleContext)
  useEffect(() => {
    setTitle("Integrations")
  }, [setTitle])

  useEffect(() => {
    if (popup) {
      const intId = setInterval(() => {
        if (popup.closed) {
          setPopup(null)
          clearInterval(intId)
          location.reload()
        }
      }, 250)

      return () => clearInterval(intId)
    }
  }, [popup, setPopup])

  function body() {
    const integrations = Object.keys(currentUser.identities)
    const integrationOptions = AVAILABLE_INTEGRATIONS.filter(
      (k) => !currentUser.identities[k]
    )

    return (
      <>
        {integrations.length ? (
          integrations.map((k) => {
            return (
              <div class="flex flex-row">
                <div className="mr-1">
                  <FontAwesomeIcon icon={INT_ICON[k]} />
                </div>
                <div className="mr-1">{INT_LABEL[k]}</div>
                {INT_LOGOUT[k] && (
                  <div>
                    <div
                      className="text-red-400 cursor-pointer"
                      onClick={() => INT_LOGOUT[k] && INT_LOGOUT[k]()}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div>No existing integrations found.</div>
        )}
        {integrationOptions.length ? (
          <>
            <p className="text-lg font-bold my-2">Available Integrations</p>
            {integrationOptions.map((k) => {
              return (
                <div
                  className="inline-flex flex-row items-center cursor-pointer"
                  onClick={() => {
                    UserService.ghInit().then(({ data: { url } }) => {
                      setPopup(popupWindow(url, "gh-init", window, 500, 750))
                    })
                  }}
                >
                  <FontAwesomeIcon icon={INT_ICON[k]} />
                  <div className="ml-1">{INT_LABEL[k]}</div>
                </div>
              )
            })}
          </>
        ) : null}
      </>
    )
  }

  return (
    <>
      <p className="text-2xl font-bold mb-2">Integrations</p>
      {body()}
    </>
  )
}

export default Integrations
