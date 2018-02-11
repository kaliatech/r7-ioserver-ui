<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <h1>Device Controllers</h1>

          <b-btn size="sm" variant="outline-primary" to="/controllers/new">
            New Device Controller
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
                <th>Device Type</th>
                <th>Connection Type</th>
                <th>Port</th>
                <th></th>
                <th></th>
              </tr>
              </thead>
              <tbody class="nowrap">
              <tr :key="ioConn.id" v-for="(ioConn) in this.ioControllers">
                <td>
                  <router-link :to="'/controllers/'+ioConn.id"><strong>{{ ioConn.id }}</strong></router-link>
                </td>
                <td>{{ioConn.type}}</td>
                <td>{{ioConn.connType}}</td>
                <td>{{ioConn.connStr}}</td>
                <td>
                  <!--
                  <button type="button" class="btn btn-link btn-sm" @click="showIoConnModal(ioConn)">
                    <font-awesome-icon icon="edit"/>
                  </button>
                  -->
                  <button type="button" class="btn btn-link btn-sm" @click="deleteIoConn(ioConn)">
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
  </div>
</template>
<script>
import axios from 'axios'

import ioSrvr from '@/shared/IoServerService'
import nSrvc from '@/shared/NotificationService'

export default {
  name: 'IoControllers',
  data () {
    return {
      loading: true,
      ioControllers: [
        {
          id: 'primary',
          type: 'pololu-maestro',
          connType: 'SERIAL',
          connStr: 'COM1'
        }
      ]
    }
  },
  created () {
    this.load()
  },
  computed: {
    rows () {
      return this.ioControllers
    }
  },
  methods: {
    load () {
      this.$Progress.start()
      axios.get('http://localhost:12080/data/controllers')
        .then((resp) => {
          // console.log(response.data)
          // console.log(response.status)
          this.ioControllers = resp.data
          this.loading = false
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          document.querySelector('.loading-msg').innerHTML = 'Unable to load controllers. ' + error
        })
    },
    addDeviceController: function () {
      console.log('addDeviceController')
    },
    deleteIoConn (ioConn) {
      ioSrvr.deleteController(this.ioConn ? this.ioConn.id : '')
        .then((ioConns) => {
          this.ioControllers = ioConns
          nSrvc.deleted('Deleted', 'Controller:' + this.ioConnEdit.id)
        })
    }
  }
}
</script>
