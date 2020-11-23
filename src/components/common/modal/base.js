import React, { useEffect, useLayoutEffect, useRef } from "preact/hooks"
import { createPortal } from "preact/compat"
import PropTypes from "prop-types"

const Modal = ({ children, onRequestClose, isOpen }) => {
  const ref = useRef()

  useFocusLock(ref)
  useKeyUp("Escape", onRequestClose)
  useLockBodyScroll()
  useOnClickOutside(ref, onRequestClose)

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-300 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          ref={ref}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

Modal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
}

export default Modal

// Focus lock hook
const FOCUSABLE_SELECTORS = [
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
  "a[href]",
  "audio[controls]",
  "button",
  "iframe",
  "input",
  "select",
  "textarea",
  "video[controls]",
]

const hasNegativeTabIndex = (el) =>
  el.getAttribute("tabindex") && el.getAttribute("tabindex") < 0

const getFocusableChildNodes = (el) => {
  const selectAll = FOCUSABLE_SELECTORS.join(",")
  const nodelist = el.querySelectorAll(selectAll)

  return Array.from(nodelist || []).filter((node) => !hasNegativeTabIndex(node))
}

function useFocusLock(ref) {
  useEffect(() => {
    const prevFocusedElement = document.activeElement

    let focusableNodes = []

    if (ref && ref.current) {
      focusableNodes = getFocusableChildNodes(ref.current)

      const firstNode = focusableNodes[0]
      if (firstNode) firstNode.focus()
    }

    const onKeyDown = (event) => {
      const isTab = event.key === "Tab"
      const withShiftKey = event.shiftKey

      if (!isTab) return

      const { activeElement } = document

      const first = focusableNodes[0]
      const last = focusableNodes[focusableNodes.length - 1]

      if (activeElement === first && withShiftKey) {
        last.focus()
        event.preventDefault()
        event.stopPropagation()
      } else if (activeElement === last && !withShiftKey) {
        first.focus()
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return function cleanup() {
      window.removeEventListener("keydown", onKeyDown)
      if (prevFocusedElement) prevFocusedElement.focus()
    }
  })
}

// lock body scroll hook
function useLockBodyScroll() {
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden"
    return () => (document.body.style.overflow = "visible")
  }, [])
}

// key up hook
function useKeyUp(targetKey, handler) {
  const onKeyUp = ({ key }) => {
    if (key === targetKey) handler()
  }

  useEffect(() => {
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])
}

// click outside hook
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [])
}
