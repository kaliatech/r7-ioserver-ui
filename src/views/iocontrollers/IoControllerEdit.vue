<template>
  <div>
    <div class="container-fluid">

      <div class="row">
        <div class="col-md-12">
          <h3 class="mb-4">Edit Controller
            <small>{{ioControllerEdit.id}}</small>
            <!-- <small>{{ioConn ? ioController.id : this.$route.params.id}}</small> --></h3>
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
                     v-model="ioControllerEdit.id">
            </div>
          </div>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Type</legend>
              <div class="col-sm-10">
                <div class="form-check" v-for="type in controllerTypes" :key="type.id">
                  <input :id="type.id" :value="type.id" v-model="ioControllerEdit.controllerTypeId"
                         name="controllerTypeId"
                         type="radio"
                         class="form-check-input"/>
                  <label class="form-check-label" :for="type.id">
                    {{ type.id }}
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-group">
            <div class="row">
              <legend class="col-form-label col-sm-2 col-xl-1 pt-0">Connection</legend>
              <div class="col-sm-10">
                <div class="form-check" v-for="type in ioConnTypes" :key="type.id">
                  <input :id="type.id" :value="type.id" v-model="ioControllerEdit.ioConnTypeId"
                         name="ioConnTypeId"
                         type="radio"
                         class="form-check-input"/>
                  <label class="form-check-label" :for="type.id">
                    {{ type.id }}
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <div class="form-group row">
            <label for="id" class="col-sm-2 col-xl-1 col-form-label">Port</label>
            <div class="col-sm-3">
              <input class="form-control" id="connStr" v-model="ioControllerEdit.ioConnStr"
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
      controllerTypes: [],
      ioConnTypes: [],
      ioControllers: [],
      ioController: null,
      ioControllerEdit: {
        id: '',
        controllerTypeId: 'pololu-maestro',
        ioConnTypeId: 'serial-asio',
        ioConnStr: ''
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
          this.ioConnTypes = resps[0]
          this.controllerTypes = resps[1]
          this.ioController = resps[2]
          if (this.ioController) {
            this.ioControllerEdit = JSON.parse(JSON.stringify(this.ioController))
          }
          this.$Progress.finish()
          this.loading = false
        })
        .catch((error) => {
          this.$Progress.fail()
          nSrvc.errored('Error', `Unable to load controller: ${ioConnId}. Message: ${error.message}`, false)
        })
        .finally(() => {
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

      ioSrvr.saveController(this.ioConn ? this.ioController.id : '', this.ioControllerEdit)
        .then((savedIoConn) => {
          let origId = this.ioController ? this.ioController.id : ''
          this.ioController = savedIoConn

          if (origId !== this.ioController.id) {
            this.$router.replace('/controllers/' + this.ioController.id)
          }
          this.load(this.ioController.id)

          nSrvc.saved('Saved', 'Controller:' + this.ioControllerEdit.id)
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          nSrvc.errored('Error', `Unable to save controller: ${this.ioControllerEdit.id}. Message: ${error.message}`)
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteController () {
      if (!this.ioController) {
        this.$router.push('/controllers')
        return
      }

      ioSrvr.deleteController(this.ioController ? this.ioController.id : '')
        .then(() => {
          nSrvc.deleted('Deleted', 'Controller:' + this.ioController.id)
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
