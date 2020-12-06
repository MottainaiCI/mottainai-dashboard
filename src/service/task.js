import axios from "@/axios"

const TaskService = {
  fetchAll() {
    return axios.get("/tasks").then(({ data }) => data || [])
  },
  fetch(id) {
    return axios.get(`/tasks/${id}`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/tasks/delete/${id}`)
  },
  start(id) {
    return axios.get(`/tasks/start/${id}`)
  },
  stop(id) {
    return axios.get(`/tasks/stop/${id}`)
  },
  clone(id) {
    return axios.get(`/tasks/clone/${id}`).then(({ data }) => data)
  },
  create(options) {
    return axios.post("/tasks", options).then(({ data }) => data)
  },
  tailOutput(id) {
    return axios.get(`/tasks/tail_output/${id}/3000`).then(({ data }) => data)
  },
  artefacts(id) {
    return axios.get(`/tasks/${id}/artefacts`).then(({ data }) => data)
  },
}

export default TaskService
