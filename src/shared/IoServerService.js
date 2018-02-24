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
          return Promise.resolve(resp.data)
        })
      })
  }

  getServos () {
    return axios.get(IO_SERVER_URL + '/data/servos')
      .then((resp) => Promise.resolve(resp.data))
  }

  getServo (id) {
    if (!id || id === 'new') {
      return Promise.resolve(null)
    }
    return this.getServos().then((servos) => {
      let servo = servos.find((it) => it.id === id)
      return Promise.resolve(servo)
    })
  }

  saveServo (origId, servo) {
    return this.getServos()
      .then((servos) => {
        if (!origId) {
          servos.push(servo)
        }
        else {
          let existingServo = servos.find((it) => it.id === origId)
          Object.assign(existingServo, servo)
        }
        return axios.post(IO_SERVER_URL + '/data/servos', servos).then((resp) => {
          return resp.data.find((it) => it.id === servo.id)
        })
      })
  }

  deleteServo (servoId) {
    return this.getServos()
      .then((servos) => {
        let existingServo = servos.find((it) => it.id === servoId)
        if (!existingServo) {
          return Promise.reject(new Error('Servo does not exist.'))
        }
        servos = servos.filter((it) => it.id !== servoId)
        return axios.post(IO_SERVER_URL + '/data/servos', servos).then((resp) => {
          return Promise.resolve(resp.data)
        })
      })
  }

  moveByPulse (servoId, currPulse) {
    console.log('moveByPulse', servoId, currPulse)
    // return Promise.resolve(true)
    return axios.post(IO_SERVER_URL + '/mbp/', {s: servoId, p: currPulse})
  }
}

export default new IoServerService()
