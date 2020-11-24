import axios from "@/axios"

const PlanService = {
  fetchAll() {
    return axios.get("/tasks/planned").then(({ data }) => data)
  },
  fetch(id) {
    return axios.get(`/tasks/plan/${id}`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/tasks/plan/delete/${id}`)
  },
}

export default PlanService
