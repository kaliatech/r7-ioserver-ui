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