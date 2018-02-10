import axios from 'axios'

const IO_SERVER_URL = 'http://localhost:12080'

class IoServerService {
  getControllers () {
    return axios.get(IO_SERVER_URL + '/data/controllers')
  }

  getController (id) {
    if (!id || id === 'new') {
      return Promise.resolve(null)
    }
    return this.getControllers().then((resp) => {
      let ioConn = resp.data.find((it) => {
        return it.id === id
      })
      return Promise.resolve(ioConn)
    })
  }

  getControllerTypes () {
    axios.get(IO_SERVER_URL + '/data/ref-controller-types')
  }

  getIoConnectionTypes () {
    axios.get(IO_SERVER_URL + '/data/ref-ioconnection-types')
  }
}

export default new IoServerService()
