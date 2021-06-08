import Loader from "@/components/common/loader"
import { useEffect } from "preact/hooks"
import UserService from "@/service/user"

export default function IntegrationCallbackHandler({ code, state }) {
  useEffect(() => {
    UserService.ghCallback({ code, state }).then(
      () => (window.location.href = "/integrations"),
      () => {}
    )
  }, [code, state])
  return <Loader />
}
