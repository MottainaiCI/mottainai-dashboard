import axios from "@/axios"

const NodeService = {
  fetchAll() {
    return axios.get("/nodes").then(({ data }) => data || [])
  },
  fetch(id) {
    return axios.get(`/nodes/show/${id}`).then(({ data }) => data)
  },
  fetchTasks(id) {
    return axios.get(`/nodes/tasks/${id}`).then(({ data }) => data || [])
  },
  delete(id) {
    return axios.get(`/nodes/delete/${id}`)
  },
  createNode() {
    return axios.get("/nodes/add")
  },
}

export default NodeService
