import Modal from "./base"
import ConfirmModal from "./confirm"
import { render, unmountComponentAtNode } from "preact/compat"

export default Modal
export { ConfirmModal }

function removeElementReconfirm() {
  const target = document.getElementById("root-modal")
  if (target) {
    unmountComponentAtNode(target)
    target.parentNode.removeChild(target)
  }
}

function createElementReconfirm({ comp: ModalComp, ...props }) {
  let divTarget = document.getElementById("root-modal")
  if (!divTarget) {
    divTarget = document.createElement("div")
    divTarget.id = "root-modal"
    document.body.appendChild(divTarget)
  }

  render(<ModalComp {...props} />, divTarget)
}

export const showConfirmModal = ({ ...props }) => {
  return new Promise((res) => {
    createElementReconfirm({
      comp: ConfirmModal,
      onConfirm() {
        removeElementReconfirm()
        res(true)
      },
      onCancel() {
        removeElementReconfirm()
        res(false)
      },
      ...props,
    })
  })
}
