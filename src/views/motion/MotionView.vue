<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-sm-6">
          <div class="">
            <div v-if="loading" class="loading-msg">
              loading. please wait...
            </div>
            <h3>Sequence </h3>

            <b-form-group>
              <div class="input-group">

                <b-form-select v-model="selectedSequenceId"
                               text-field="id"
                               value-field="id"
                               :options="sequences"
                               style="display:inline"/>

                <div class="input-group-append">
                  <b-btn variant="outline-primary" size="sm" @click="showEditSequenceModal">
                    <font-awesome-icon icon="edit"/>
                  </b-btn>
                  <b-btn variant="outline-primary" size="sm" @click="showSequenceDeleteModal = true">
                    <font-awesome-icon icon="trash-alt"/>
                  </b-btn>
                </div>

                <div class="input-group-append ml-3">
                  <b-btn variant="outline-primary" size="sm" @click="showNewSequenceModal">
                    <font-awesome-icon icon="plus-square"/>
                  </b-btn>
                </div>
              </div>
            </b-form-group>

            <div>
              <b-btn variant="outline-primary">
                <font-awesome-icon icon="play" flip="horizontal"/>
              </b-btn>
              <b-btn variant="outline-primary">
                <font-awesome-icon icon="stop"/>
              </b-btn>
              <b-btn variant="outline-primary">
                <font-awesome-icon icon="play"/>
              </b-btn>

              <b-form-checkbox
                v-model="loopPlayer"
                :value="true"
                class="ml-3"
                :unchecked-value="false">
                cycle
              </b-form-checkbox>

              <div style="display:inline-block">
                Speed
                <b-form-input v-model="speed" style="display:inline-block; width:4em"></b-form-input>
                x
              </div>

            </div>

          </div>

        </div>
      </div>

      <hr/>
      <!--
            <div class="row">
              <div class="col-12 col-sm-6 mt-3">
                <h5>Previous Sequence
                  <small>default</small>
                </h5>
                <b-form-select v-model="selectedSequenceId"
                               text-field="id"
                               value-field="id"
                               :options="sequences">

                </b-form-select>
              </div>
            </div>-->

      <div class="row mt-3">
        <div class="col-12">
          <h5 style="display: inline-block">Actions</h5>
          <b-form-checkbox
            v-model="loopPlayer"
            :value="true"
            class="ml-3"
            :unchecked-value="false">
            live
          </b-form-checkbox>

        </div>
      </div>

      <div class="row movements">
        <div class="col-12">
          <table class="table table-sm table-striped mt-3">
            <thead class="nowrap">
            <tr>
              <th style="width:6rem">Time
                <small>ms</small>
              </th>
              <th style="width:15rem">Servo</th>
              <th style="width:6rem">Target
                <small>degrees</small>
              </th>
              <th style="width:6rem">Dur
                <small>ms</small>
              </th>
              <th>
              </th>
              <th style="width:6rem">Speed
                <small>deg/s</small>
              </th>
              <th style="width:6rem">Accel</th>
              <th style="width:6rem">Deaccel</th>
              <th></th>
              <th></th>
            </tr>
            </thead>
            <tbody v-if="currSequence" class="nowrap">
            <tr :key="action.time + '-' + action.servoId" v-for="(action, idx) in currSequence.actions">
              <td>
                <b-form-input v-model="action.time" @input="onActionChange"></b-form-input>
              </td>
              <td>
                <b-form-select v-model="action.servoId"
                               text-field="id"
                               value-field="id"
                               :options="servos"
                               style="width:12rem"
                               @change="onActionChange"/>
              </td>
              <td>
                <b-form-input v-model="action.target" @change="onActionChange"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="action.duration" @change="onActionChange"></b-form-input>
              </td>
              <td><p>or</p></td>
              <td>
                <b-form-input v-model="action.speed" @change="onActionChange"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="action.accel" @change="onActionChange"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="action.deaccel" @change="onActionChange"></b-form-input>
              </td>
              <td>
                <b-btn style="width:5em" size="sm" class="sm-row">Move</b-btn>
                <b-btn style="width:5em" size="sm" class="sm-row">Set...</b-btn>
                <b-btn variant="link" size="sm">
                  <font-awesome-icon icon="trash-alt" @click="actionToDeleteIdx = idx; showActionDeleteModal = true"/>
                </b-btn>
              </td>
              <td style="width:80%"></td>
            </tr>
            <tr>
              <td colspan="8">
                <b-btn size="sm" class="sm-row" style="width:5rem" variant="outline-primary" @click="addAction">
                  Add action
                </b-btn>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

    <b-modal id="mdl-new-sequence"
             title="New Sequence"
             v-model="showSequenceNameModal"
             @shown="onNewSequenceModalShown"
             @ok="onNewSequenceModalOkay">
      <form @submit.stop.prevent="onNewSequenceModalSubmit">
        <label>Name</label>
        <input ref="newSequenceName" class="form-control" type="text" v-model="newSequenceName">
      </form>
    </b-modal>

    <b-modal v-if="currSequence"
             id="mdl-delete-sequence"
             title="Delete Sequence"
             v-model="showSequenceDeleteModal"
             @ok="onDeleteSequenceConfirm">
      Delete sequence: {{this.currSequence.id}}?
    </b-modal>

  </div>
</template>
<script>
import ioSrvr from '@/shared/IoServerService'

export default {
  name: 'MotionView',
  data () {
    return {
      currAction: null,
      loading: true,
      loopPlayer: true,
      live: false,
      newSequenceName: '',
      sequences: [],
      servos: [],
      speed: 1.0,
      selectedSequenceId: null,
      showSequenceDeleteModal: false,
      showSequenceNameModal: false
    }
  },
  created () {
    this.load()
  },
  computed: {
    currSequence () {
      return this.sequences.find(it => this.selectedSequenceId === it.id)
    }
  },
  watch: {
    currSequence () {
      this.currSequence.actions.sort((a, b) => parseInt(a.time) - parseInt(b.time))
    }
  },
  methods: {
    addAction () {
      if (!this.currSequence.actions) {
        this.currSequence.actions = []
      }
      let lastAction = this.currSequence.actions.slice(-1)[0]

      let action = {
        time: lastAction ? lastAction.time : 0,
        type: lastAction ? lastAction.type : 'SERVO_MOVE',
        servoId: null,
        target: lastAction ? lastAction.target : 1500,
        duration: lastAction ? lastAction.duration : 1000,
        accel: lastAction ? lastAction.accel : 0,
        deaccel: lastAction ? lastAction.deaccel : 0
      }
      this.currSequence.actions.push(action)
      ioSrvr.saveSequence(this.currSequence.id, this.currSequence)
    },
    load () {
      this.$Progress.start()
      ioSrvr.getServos()
        .then((servos) => {
          this.servos = servos
        })

      ioSrvr.getSequences()
        .then((sequences) => {
          // console.log(sequences)
          this.sequences = sequences
          this.$Progress.finish()
        })
        .catch((error) => {
          this.$Progress.fail()
          console.log(error)
        })
        .finally(() => {
          this.loading = false
        })
      // this.sequences = sequences
    },
    onActionChange () {
      // todo: validation
      this.$Progress.start()

      this.currSequence.actions.sort((a, b) => parseInt(a.time) - parseInt(b.time))

      ioSrvr.saveSequence(this.currSequence.id, this.currSequence)
        .then(() => {
          this.$Progress.finish()
        })
        .catch(() => {
          this.$Progress.fail()
        })
    },
    onDeleteSequenceConfirm () {
      this.$Progress.start()
      ioSrvr.deleteSequence(this.currSequence.id)
        .then(() => {
          this.sequences.splice(this.sequences.indexOf(this.currSequence), 1)
          this.selectedSequenceId = null
          this.$Progress.finish()
        })
        .catch((err) => {
          console.log('Error', err)
          this.$Progress.fail()
        })
    },
    onNewSequenceModalShown () {
      this.$refs.newSequenceName.focus()
    },
    onNewSequenceModalOkay (evt) {
      evt.preventDefault()
      this.onNewSequenceModalSubmit()
    },
    onNewSequenceModalSubmit () {
      let seq = {id: this.newSequenceName}
      ioSrvr.saveSequence(null, seq)
        .then((newSeq) => {
          this.$Progress.start()
          this.sequences.push(newSeq)
          this.selectedSequenceId = newSeq.id
          this.showSequenceNameModal = false
          this.newSequenceName = ''
          this.$Progress.finish()
        })
        .catch((err) => {
          console.log('Error', err)
          this.$Progress.fail()
        })
    },
    showNewSequenceModal () {
      this.showSequenceNameModal = true
    },
    showEditSequenceModal () {
      this.showSequenceNameModal = true
    }
  }
}
</script>

<style lang="scss">
  .btn {
    margin: 0 0.1rem;
    border-radius: 0;
  }

  .actions table th {
    font-weight: bold;
    font-size: smaller;
  }

  .row.movements {
    th, input, select {
      width: 3rem;
      padding: 0.125rem 0.25rem;
      font-size: .75rem;
    }
    p {
      font-size: .75rem;
    }
    button.sm-row {
      width: 3rem;
      padding: 0.125rem 0.25rem;
      font-size: .75rem;
    }
    select.form-control {
      height: calc(1.5rem + 2px);
    }
  }

  div.frame-btns-cont {
    margin-top: 0.25rem;
    .btn {
      font-size: 0.6rem;
      margin: 0 1px;
      padding: 0.375rem 0.55rem;
      border-radius: 0;

      /*
            &:hover {
              background-color: inherit;
            }
      */
    }
  }
</style>
