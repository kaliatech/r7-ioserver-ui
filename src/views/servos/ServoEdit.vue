<template>
  <div>
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-12">
          <h3 class="mb-4">Edit Servo
            <small>{{servoFbo.id}}</small>
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
                     v-model="servoFbo.id">
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

          <div class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Controller</legend>
              <div class="col-sm-3">
                <b-form-select v-model="servoFbo.ioControllerId" :options="ioControllersForSelect" class="mb-3"/>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">Pin</label>
            <div class="col-sm-3">
              <input class="form-control" id="pin" v-model="servoFbo.pin"
                     placeholder="controller pin">
            </div>
          </div>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">Init Pulse</label>
            <div class="col-sm-3">
              <input class="form-control" id="initPulse" type="number" v-model.number="servoFbo.initPulse"
                     placeholder="initial pulse">
            </div>
          </div>

          <div class="form-group row">
            <label for="id" class="col-2 col-xl-1 col-form-label">Start Pulse</label>
            <div class="col-3">
              <input class="form-control" id="startPulse" type="number" v-model.number="servoFbo.startPulse"
                     placeholder="">
            </div>

            <label for="id" class="col-2 col-xl-1 col-form-label">Start Deg</label>
            <div class="col-3">
              <input class="form-control" id="startDeg" type="number" v-model.number="servoFbo.startDeg"
                     placeholder="">
            </div>
          </div>

          <div class="form-group row">
            <label for="id" class="col-2 col-xl-1 col-form-label">End Pulse</label>
            <div class="col-3">
              <input class="form-control" id="endPulse" type="number" v-model.number="servoFbo.endPulse"
                     placeholder="">
            </div>

            <label for="id" class="col-2 col-xl-1 col-form-label">End Deg</label>
            <div class="col-3">
              <input class="form-control" id="endDeg" type="number" v-model.number="servoFbo.endDeg"
                     placeholder="">
            </div>
          </div>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label"></label>
            <div class="col-3">
              <b-btn variant="primary" @click="showServoCalibrate(servo)">Calibrate...</b-btn>
              <ServoCalibrateModal v-if="servo" :showModal="showCalibrateModal" :servo.sync="servoFbo"
                                   @hidden="showCalibrateModal = false" @saved="onServoCalibrateApply"/>
            </div>
          </div>

          <hr/>

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

import ServoCalibrateModal from '@/components/ServoCalibrateModal'

export default {
  name: 'ServoEdit',
  components: {ServoCalibrateModal},
  data () {
    return {
      ioControllers: [],
      servo: null,
      servoFbo: {
        id: '',
        pin: '',
        initPulse: 1500,
        startPulse: 500,
        startDeg: 0,
        endPulse: 2000,
        endDeg: 180
      },
      showCalibrateModal: false,
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
            this.servoFbo = JSON.parse(JSON.stringify(this.servo))
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
    showServoCalibrate (servo) {
      this.selectedServo = servo
      this.showCalibrateModal = true
    },
    saveEdit: function () {
      const frm = document.getElementById('editForm')
      frm.classList.add('was-validated')
      if (!frm.checkValidity()) {
        return
      }

      this.loading = true
      this.$Progress.start()

      ioSrvr.saveServo(this.servo ? this.servo.id : '', this.servoFbo)
        .then((savedServo) => {
          this.servo = savedServo
          nSrvc.saved('Saved', 'Servo:' + this.servoFbo.id)
          this.$Progress.finish()
          this.$router.push('/servos')
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
          nSrvc.deleted('Deleted', 'Servo:' + this.servoFbo.id)
          this.$router.push('/servos')
        })
    },
    cancelEdit: function () {
      this.$router.push('/servos')
    },
    onServoCalibrateApply (servoCalibrateEdit) {
      this.servoFbo = servoCalibrateEdit
    }
  }
}
</script>
<style scoped>
  /* Remove controls from Safari and Chrome */
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0; /* Removes leftover margin */
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
</style>
