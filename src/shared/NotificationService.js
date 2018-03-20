import iziToast from 'izitoast'

// https://github.com/dolce/iziToast

class NotificationService {
  saved (title, msg) {
    iziToast.show({
      color: 'green',
      message: msg || '',
      overlay: false,
      position: 'topRight',
      timeout: 2300,
      title: title || ''
    })
  }

  errored (title, msg, autoClose = true) {
    iziToast.show({
      color: 'red',
      message: msg || '',
      overlay: false,
      position: 'topRight',
      timeout: autoClose === true ? 5000 : null,
      title: title || ''
    })
  }

  deleted (title, msg) {
    iziToast.show({
      color: 'red',
      message: msg || '',
      overlay: false,
      position: 'topRight',
      timeout: 2300,
      title: title || ''
    })
  }

  canceled (title, msg) {
    iziToast.show({
      color: 'yellow',
      message: msg || '',
      overlay: false,
      position: 'topRight',
      title: title || ''
    })
  }
}

export default new NotificationService()
