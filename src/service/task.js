import axios from "@/axios"

const TaskService = {
  fetchAll() {
    return axios.get("/tasks").then(({ data }) => data)
  },
  fetch(taskId) {
    return axios.get(`/tasks/${taskId}`).then(({ data }) => data)
  },
  delete(taskId) {
    return axios.get(`/tasks/delete/${taskId}`)
  },
  start(taskId) {
    return axios.get(`/tasks/start/${taskId}`)
  },
  stop(taskId) {
    return axios.get(`/tasks/stop/${taskId}`)
  },
  clone(taskId) {
    return axios.get(`/tasks/clone/${taskId}`)
  },
}

export default TaskService
