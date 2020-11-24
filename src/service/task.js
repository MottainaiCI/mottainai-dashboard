import axios from "@/axios"

const TaskService = {
  fetchAll() {
    return axios.get("/tasks").then(({ data }) => data)
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
    return axios.get(`/tasks/clone/${id}`)
  },
}

export default TaskService
