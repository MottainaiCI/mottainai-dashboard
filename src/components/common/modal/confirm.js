import Modal from "./"

const ConfirmModal = ({
  onCancel = () => {},
  onConfirm = () => {},
  isOpen,
  title = "",
  body = "",
  confirmColor = "red",
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            {title && (
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
            )}
            <div class="mt-2">
              <p class="text-sm text-gray-500 select-text">{body}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between sm:flex-row-reverse">
        <button
          type="button"
          class={`w-full inline-flex justify-center rounded-md border border-transparent
            shadow-sm px-4 py-2 bg-${confirmColor}-600 text-base font-medium text-white
            hover:bg-${confirmColor}-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300
            shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50
            focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
