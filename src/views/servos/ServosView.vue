<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h1>Servos</h1>
          <b-btn size="sm" variant="outline-primary" to="/servos/new">
            New Servo
          </b-btn>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="">
            <div v-if="loading" class="loading-msg">
              loading. please wait...
            </div>
            <table v-if="!loading" class="table table-sm table-striped tbl-list mt-3">
              <thead class="nowrap">
              <tr>
                <th>Name</th>
                <th></th>
                <th>Controller</th>
                <th>Pin</th>
                <th>Init
                  <small class="text-muted">(pulse)</small>
                </th>
                <th>Start
                  <small class="text-muted">(pulse)</small>
                </th>
                <th>Start
                  <small class="text-muted">(deg)</small>
                </th>
                <th>End
                  <small class="text-muted">(pulse)</small>
                </th>
                <th>End
                  <small class="text-muted">(deg)</small>
                </th>
                <th></th>
                <th></th>
              </tr>
              </thead>
              <tbody class="nowrap">
              <tr :key="servo.id" v-for="(servo) in this.servos">
                <td>
                  <router-link :to="'/servos/'+servo.id"><strong>{{ servo.id }}</strong></router-link>
                </td>
                <td>
                  <b-button size="sm" variant="primary" @click="showServoCalibrate(servo)">
                    Calibrate...
                  </b-button>
                </td>
                <td>
                  {{ servo.ioControllerId }}
                </td>
                <td>
                  {{ servo.pin }}
                </td>
                <td>{{servo.initPulse}}</td>
                <td>{{servo.startPulse}}</td>
                <td>{{servo.startDeg}}</td>
                <td>{{servo.endPulse}}</td>
                <td>{{servo.endDeg}}</td>
                <td>
                  <button type="button" class="btn btn-link btn-sm" @click="deleteServo(servo)">
                    <font-awesome-icon icon="trash-alt"/>
                  </button>
                </td>
                <td style="width:100%"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <ServoCalibrateModal v-if="selectedServo"
                         okTitle="Save"
                         :showModal="showCalibrateModal"
                         :servo="selectedServo"
                         @hidden="showCalibrateModal = false"
                         @saved="onServoCalibrateSave"/>
  </div>
</template>
<script>
import ioSrvr from '@/shared/IoServerService'
import nSrvc from '@/shared/NotificationService'

import ServoCalibrateModal from '@/components/ServoCalibrateModal'

export default {
  name: 'ServosView',
  components: {ServoCalibrateModal},
  data () {
    return {
      loading: true,
      servos: [],
      selectedServo: null,
      showCalibrateModal: false
    }
  },
  created () {
    this.load()
  },
  computed: {
    // servoGroups () {
    //   this.servo.map((it) => servo.group)
    // }
  },
  methods: {
    showServoCalibrate (servo) {
      this.selectedServo = servo
      this.showCalibrateModal = true
    },
    load () {
      this.$Progress.start()
      ioSrvr.getServos()
        .then((servos) => {
          this.servos = servos
          this.loading = false
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          document.querySelector('.loading-msg').innerHTML = 'Unable to load servos. ' + error
        })
    },
    deleteServo (servo) {
      ioSrvr.deleteServo(servo.id)
        .then((servos) => {
          this.servos = servos
          nSrvc.deleted('Deleted', 'Servo:' + servo.id)
        })
        .catch((error) => {
          console.log('error', error)
          nSrvc.errored('Error', `Unable to delete servo: ${servo.id}. Reason: ${error.message}`)
          this.load()
        })
    },
    onServoCalibrateSave (servoCalibrateEdit) {
      this.loading = true
      ioSrvr.saveServo(servoCalibrateEdit.id, servoCalibrateEdit)
        .then((savedServo) => {
          this.selectedServo = savedServo
          nSrvc.saved('Saved', 'Servo:' + savedServo.id)
          this.$Progress.finish()
        })
        .finally(() => {
          this.load()
        })
    }
  }
}
</script>
