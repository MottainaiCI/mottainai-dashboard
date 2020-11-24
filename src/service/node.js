import axios from "@/axios"

const NodeService = {
  fetchAll() {
    return axios.get("/nodes").then(({ data }) => data)
  },
  fetch(id) {
    return axios.get(`/nodes/${id}`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/nodes/delete/${id}`)
  },
}

export default NodeService
