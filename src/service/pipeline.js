import axios from "@/axios"

const PipelineService = {
  fetchAll() {
    const ans = axios.get("/tasks/pipelines").then(function(resp) {
      if (resp.data == null) {
        return []
      } else {
        return resp.data
      }
    });
    return ans
  },
  fetch(id) {
    return axios.get(`/tasks/pipeline/${id}`).then(({ data }) => data)
  },
  delete(id) {
    return axios.get(`/tasks/pipelines/delete/${id}`)
  },
}

export default PipelineService
