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
    // return this.getControllers().then((controllers) => {
    //   let ioConn = controllers.find((it) => it.id === id)
    //   return Promise.resolve(ioConn)
    // })
    return axios.get(IO_SERVER_URL + '/data/controllers/' + id)
      .then((resp) => {
        return resp.data
      })
  }

  getControllerTypes () {
    return axios.get(IO_SERVER_URL + '/data/controller_types')
      .then((resp) => {
        return resp.data
      })
  }

  getIoConnectionTypes () {
    return axios.get(IO_SERVER_URL + '/data/ioconnection_types')
      .then((resp) => {
        return resp.data
      })
  }

  saveController (origId, ioConn) {
    // return this.getControllers()
    //   .then((conns) => {
    //     if (!origId) {
    //       conns.push(ioConn)
    //     }
    //     else {
    //       let existingIoConn = conns.find((it) => it.id === origId)
    //       Object.assign(existingIoConn, ioConn)
    //     }
    //    return axios.post(IO_SERVER_URL + '/data/controllers', ioConn).then((resp) => {
    //      return resp.data.find((it) => it.id === ioConn.id)
    //    })
    //  })
    let url = IO_SERVER_URL + '/data/controllers'
    if (origId) {
      url += '/' + origId
    }
    return axios.post(url, ioConn).then((resp) => {
      return resp.data
    })
  }

  deleteController (ioConnId) {
    // return this.getControllers()
    //   .then((conns) => {
    //     let existingIoConn = conns.find((it) => it.id === ioConnId)
    //     if (!existingIoConn) {
    //       return Promise.resolve(false)
    //     }
    //
    //     conns = conns.filter((it) => it.id !== ioConnId)
    //
    //     return axios.post(IO_SERVER_URL + '/data/controllers', conns).then((resp) => {
    //       return Promise.resolve(resp.data)
    //     })
    //   })
    return axios.delete(IO_SERVER_URL + '/data/controllers/' + ioConnId).then((resp) => {
      return resp.data
    })
  }

  getServos () {
    return axios.get(IO_SERVER_URL + '/data/servos')
      .then((resp) => {
        return resp.data
      })
  }

  getServo (id) {
    if (!id || id === 'new') {
      return Promise.resolve(null)
    }
    return axios.get(IO_SERVER_URL + '/data/servos/' + id)
      .then((resp) => {
        return resp.data
      })
  }

  saveServo (origId, servo) {
    let url = IO_SERVER_URL + '/data/servos'
    if (origId) {
      url += '/' + origId
    }
    return axios.post(url, servo).then((resp) => {
      return resp.data
    })
  }

  deleteServo (servoId) {
    return axios.delete(IO_SERVER_URL + '/data/servos/' + servoId).then((resp) => {
      return resp.data
    })
  }

  moveByPulse (servoId, currPulse) {
    console.log('moveByPulse', servoId, currPulse)
    // return Promise.resolve(true)
    // return axios.post(IO_SERVER_URL + '/mbp/', {s: servoId, p: currPulse})
    return axios.post(IO_SERVER_URL + '/mbp/' + servoId + '/' + currPulse)
  }
}

export default new IoServerService()
