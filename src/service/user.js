import axios from "@/axios"

const UserService = {
  // user management
  getAllusers() {
    return axios.get("/user/list").then(({ data }) => data)
  },
  fetchUser(id) {
    return axios.get(`/user/show/${id}`).then(({ data }) => data)
  },
  deleteUser(id) {
    return axios.post(`/v1/client/users/delete/${id}`)
  },
  createUser(body) {
    return axios.post(`/v1/client/users/create/`, body)
  },
  updateUser(id, body) {
    return axios.post(`/v1/client/users/edit/${id}`, body)
  },

  // integrations
  ghInit() {
    return axios.get("/v1/client/auth/int/github")
  },
  ghLogout() {
    return axios.post("/v1/client/auth/int/github_logout")
  },
}

export default UserService
