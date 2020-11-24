import axios from "@/axios"

const PipelineService = {
  fetchAll() {
    return axios.get("/tasks/pipelines").then(({ data }) => data)
  },
  fetch(id) {
    return axios.get(`/tasks/pipeline/${id}`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/tasks/pipelines/delete/${id}`)
  },
}

export default PipelineService
