import axios from "@/axios"

const TaskService = {
  fetchAll() {
    return axios.get("/tasks").then(({ data }) => data)
  },
  delete(taskId) {
    return axios.get(`/tasks/delete/${taskId}`)
  },
  stop(taskId) {
    return axios.get(`/tasks/stop/${taskId}`)
  },
  clone(taskId) {
    return axios.get(`/tasks/clone/${taskId}`)
  },
}

export default TaskService
