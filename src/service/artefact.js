import axios from "@/axios"

const ArtefactService = {
  fetchNamespaces() {
    return axios.get("/namespace/list").then(({ data }) => data || [])
  },
  fetchArtefacts(namespace) {
    return axios.get(`/namespace/${namespace}/list`).then(({ data }) => data)
  },
}

export default ArtefactService
