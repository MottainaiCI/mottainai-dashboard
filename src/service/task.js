import axios from "@/axios"

const TaskService = {
  fetchAll() {
    return axios.get("/tasks").then(({ data }) => data)
  },
  delete(taskId) {
    return axios.get(`/tasks/delete/${taskId}`)
  },
}

export default TaskService
