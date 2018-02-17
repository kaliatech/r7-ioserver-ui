<template>
  <div>
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-12">
          <h3 class="mb-4">Edit Servo
            <small>{{servoEdit.id}}</small>
          </h3>
        </div>
      </div>
      <div v-if="loading">
        <font-awesome-icon icon="spinner" spin/>
      </div>
      <div v-if="!loading">
        <form id="editForm" class="h-frm needs-validation" novalidate>
          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">ID</label>
            <div class="col-sm-3">
              <input class="form-control"
                     id="id"
                     placeholder="required"
                     required
                     v-model="servoEdit.id">
            </div>
          </div>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Type</legend>
              <div class="col-sm-10">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="servoType" id="servoType"
                         value="generic-rc" checked>
                  <label class="form-check-label" for="servoType">
                    generic-rc
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Controller</legend>
              <div class="col-sm-10">
                <b-form-select v-model="servoEdit.ioControllerId" :options="ioControllersForSelect" class="mb-3"/>
              </div>
            </div>
          </fieldset>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">Port</label>
            <div class="col-sm-3">
              <input class="form-control" id="connStr" v-model="servoEdit.initPulse"
                     placeholder="initial pulse">
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-2 col-xl-1"></div>
            <div class="col-sm-10">
              <button class="btn btn-primary" style="width:5rem" @click.prevent="saveEdit">Save</button>
              <b-btn v-b-modal.delete-confirm-mdl variant="outline-danger">Delete</b-btn>
              <button class="btn btn-outline-secondary" style="width:5rem" @click.prevent="cancelEdit">Back</button>
            </div>
          </div>

          <b-modal id="delete-confirm-mdl" size="sm" centered no-fade hide-header @ok="deleteController">
            <font-awesome-icon icon="exclamation-circle" style="margin-right:0.25rem"/>
            Delete controller?
          </b-modal>

        </form>
      </div>
    </div>
  </div>
</template>
<script>
import ioSrvr from '@/shared/IoServerService'
import nSrvc from '@/shared/NotificationService'

export default {
  name: 'ServoEdit',
  data () {
    return {
      ioControllers: [],
      servo: null,
      servoEdit: {
        id: '',
        initPulse: 1500
      },
      loading: true
    }
  },
  computed: {
    ioControllersForSelect () {
      return this.ioControllers.map((it) => {
        return {'text': it.id, 'value': it.id}
      })
    }
  },
  mounted () {
    this.load(this.$route.params.id)
  },
  methods: {
    load: function (servoId) {
      this.loading = true
      this.$Progress.start()

      Promise.all([ioSrvr.getControllers(),
        ioSrvr.getServo(servoId)])
        .then((resps) => {
          this.ioControllers = resps[0]
          if (resps[1]) {
            this.servo = resps[1]
            this.servoEdit = JSON.parse(JSON.stringify(this.servo))
          }
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          document.querySelector('.loading-msg').innerHTML = 'Unable to load servos. ' + error
        })
        .finally(() => {
          this.loading = false
        })
    },
    saveEdit: function () {
      const frm = document.getElementById('editForm')
      frm.classList.add('was-validated')
      if (!frm.checkValidity()) {
        return
      }

      this.loading = true
      this.$Progress.start()

      ioSrvr.saveServo(this.servo ? this.servo.id : '', this.servoEdit)
        .then((savedServo) => {
          this.servo = savedServo
          nSrvc.saved('Saved', 'Servo:' + this.servoEdit.id)
          this.$Progress.finish()
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteController () {
      if (!this.servo) {
        this.$router.push('/servos')
        return
      }

      ioSrvr.deleteServo(this.servo ? this.servo.id : '')
        .then(() => {
          nSrvc.deleted('Deleted', 'Servo:' + this.servoEdit.id)
          this.$router.push('/servos')
        })
    },
    cancelEdit: function () {
      this.$router.push('/servos')
    }
  }
}
</script>

<style lang="scss" scoped>
  /*
    @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

    @include media-breakpoint-up(sm) {
      .h-frm .col-form-label {
        text-align: right;
      }
    }
  */
</style>
