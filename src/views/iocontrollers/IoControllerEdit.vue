<template>
  <div>
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-12">
          <h3 class="mb-4">Edit Controller
            <small>{{ioConnEdit.id}}</small><!-- <small>{{ioConn ? ioConn.id : this.$route.params.id}}</small> --></h3>
        </div>
      </div>
      <div v-if="loading">
        <font-awesome-icon icon="spinner" spin/>
      </div>
      <div v-if="!loading">
        <form class="h-frm">
          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">ID</label>
            <div class="col-sm-3">
              <input class="form-control"
                     id="id"
                     placeholder="required"
                     v-model="ioConnEdit.id">
            </div>
          </div>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Device</legend>
              <div class="col-sm-10">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="deviceType" id="deviceType"
                         value="pololu-maestro-8" checked>
                  <label class="form-check-label" for="deviceType">
                    pololu-maestro-8
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Connection</legend>
              <div class="col-sm-10">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="connType" id="connType" value="asio-serial"
                         checked>
                  <label class="form-check-label" for="connType">
                    asio-serial
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">Port</label>
            <div class="col-sm-3">
              <input class="form-control" id="connStr" v-model="ioConnEdit.connStr"
                     placeholder="serial device path or port name">
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
  name: 'IoControllerEdit',
  data () {
    return {
      ioControllers: [],
      ioConn: null,
      ioConnEdit: {
        id: '',
        connStr: ''
      },
      loading: true
    }
  },
  computed: {},
  mounted () {
    this.load(this.$route.params.id)
  },
  methods: {
    load: function (ioConnId) {
      this.loading = true
      this.$Progress.start()

      Promise.all([ioSrvr.getIoConnectionTypes(),
        ioSrvr.getControllerTypes(),
        ioSrvr.getController(ioConnId)])
        .then((resps) => {
          if (resps[2]) {
            this.ioConn = resps[2]
            this.ioConnEdit = JSON.parse(JSON.stringify(this.ioConn))
          }
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          document.querySelector('.loading-msg').innerHTML = 'Unable to load controllers. ' + error
        })
        .finally(() => {
          console.log('finally')
          this.loading = false
        })
    },
    saveEdit: function () {
      this.loading = true
      this.$Progress.start()

      ioSrvr.saveController(this.ioConn ? this.ioConn.id : '', this.ioConnEdit)
        .then((savedIoConn) => {
          this.ioConn = savedIoConn
          nSrvc.saved('Saved', 'Controller:' + this.ioConnEdit.id)
          this.$Progress.finish()
          // this.load(this.ioConn.id)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteController () {
      if (!this.ioConn) {
        this.$router.push('/controllers')
        return
      }

      ioSrvr.deleteController(this.ioConn ? this.ioConn.id : '')
        .then(() => {
          nSrvc.deleted('Deleted', 'Controller:' + this.ioConnEdit.id)
          this.$router.push('/controllers')
        })
    },
    cancelEdit: function () {
      this.$router.push('/controllers')
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
