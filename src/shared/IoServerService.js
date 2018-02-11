import axios from 'axios'

const IO_SERVER_URL = 'http://localhost:12080'

class IoServerService {
  getControllers () {
    return axios.get(IO_SERVER_URL + '/data/controllers')
      .then((resp) => Promise.resolve(resp.data))
  }

  getController (id) {
    if (!id || id === 'new') {
      return Promise.resolve(null)
    }
    return this.getControllers().then((controllers) => {
      let ioConn = controllers.find((it) => it.id === id)
      return Promise.resolve(ioConn)
    })
  }

  getControllerTypes () {
    return axios.get(IO_SERVER_URL + '/data/ref-controller-types')
  }

  getIoConnectionTypes () {
    return axios.get(IO_SERVER_URL + '/data/ref-ioconnection-types')
  }

  saveController (origId, ioConn) {
    return this.getControllers()
      .then((conns) => {
        if (!origId) {
          conns.push(ioConn)
        }
        else {
          let existingIoConn = conns.find((it) => it.id === origId)
          Object.assign(existingIoConn, ioConn)
        }
        return axios.post(IO_SERVER_URL + '/data/controllers', conns).then((resp) => {
          return resp.data.find((it) => it.id === ioConn.id)
        })
      })
  }

  deleteController (ioConnId) {
    return this.getControllers()
      .then((conns) => {
        let existingIoConn = conns.find((it) => it.id === ioConnId)
        if (!existingIoConn) {
          return Promise.resolve(false)
        }

        conns = conns.filter((it) => it.id !== ioConnId)

        return axios.post(IO_SERVER_URL + '/data/controllers', conns).then((resp) => {
          return resp.data
        })
      })
  }
}

export default new IoServerService()
