<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-6 col-sm-6 col-md-3">
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
                  <b-btn variant="outline-primary">
                    <font-awesome-icon icon="plus-square"/>
                  </b-btn>
                </div>

              </div>
            </b-form-group>
          </div>
        </div>
        <div class="col-6 text-right">
          <b-form-select v-model="selectedSequenceId"
                         text-field="id"
                         value-field="id"
                         :options="sequences"
                         style="display:inline; width:10em"/>

          <b-btn variant="outline-primary">
            <font-awesome-icon icon="play" flip="horizontal"/>
          </b-btn>
          <b-btn variant="outline-primary">
            <font-awesome-icon icon="play"/>
          </b-btn>

          <b-form-select v-model="selectedSequenceId"
                         text-field="id"
                         value-field="id"
                         :options="sequences"
                         :disabled="true"
                         style="display:inline; width:10em"/>

          <b-form-checkbox id="checkbox1"
                           v-model="loopPlayer"
                           :value="true"
                           class="ml-3"
                           :unchecked-value="false">
            cycle
          </b-form-checkbox>

<!--
          <div class="frame-btns-cont container">
            <b-row>
              <b-col style="padding-right:0">
                <div v-for="(frame, idx) in frames" v-bind:key="`frame-${idx}`" style="display: inline-block">
                  <b-button v-model="frame.enabled" @click="frame.enabled = !frame.enabled"
                            :variant="frame.enabled ? 'primary' : 'outline-primary'"
                            :pressed-tmp="frame.enabled">
                    {{idx + 1}}
                  </b-button>
                  <br>
                  <div style="text-align: center">
                    <span v-if="playerCurrentFrame === idx">
                    x
                    </span>
                    <span v-else>
                      &nbsp;
                    </span>
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
-->

        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <h4>Frame
            <div style="display:inline">
              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="chevron-left"/>
              </b-btn>
              <b-form-input v-model="currFrameIdx"
                            type="text"
                            size="sm"
                            style="width:3rem; display:inline; text-align: center"></b-form-input>
              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="chevron-right"/>
              </b-btn>

              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="plus-square"/>
              </b-btn>

              <b-form-checkbox id="checkbox2"
                               v-model="live"
                               :value="true"
                               class="ml-3"
                               size="sm"
                               :unchecked-value="false">
                live
              </b-form-checkbox>

            </div>
          </h4>
        </div>
      </div>

      <!--<b-row>-->
      <!--<b-col sm="2"><label for="frameDuration">Duration</label></b-col>-->
      <!--<b-col sm="9">-->
      <!--<b-form-input :id="`type-${type}`" :type="type"></b-form-input>-->
      <!--</b-col>-->
      <!--</b-row>-->

      <div class="row movements">
        <div class="col-12">
          <table class="table table-sm table-striped tbl-list mt-3">
            <thead class="nowrap">
            <tr>
              <th style="width:12rem">Servo</th>
              <th style="width:6rem">Start</th>
              <th style="width:6rem">Dest</th>
              <th style="width:6rem">Dur</th>
              <th style="width:6rem">Accel</th>
              <th style="width:6rem">Deaccel</th>
              <th></th>
            </tr>
            </thead>
            <tbody class="nowrap">
            <tr :key="movement.servoId" v-for="(movement) in currFrame.movements">
              <td>
                <b-form-select v-model="selectedSequenceId"
                               text-field="id"
                               value-field="id"
                               :options="sequences"
                               style="display:inline"/>
              </td>
              <td>
                <b-form-input v-model="movement.start"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="movement.destAngle"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="movement.duration"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="movement.accel"></b-form-input>
              </td>
              <td>
                <b-form-input v-model="movement.deaccel"></b-form-input>
              </td>

              <td style="xwidth:80%"></td>
            </tr>
            <tr>
              <td colspan="7">
                <b-btn size="sm" variant="outline-primary">
                  Add movement
                </b-btn>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

let sequences = [
  {id: 'sequence-1'},
  {id: 'sequence-2'}
]

export default {
  name: 'MotionView',
  data () {
    return {
      currFrameIdx: 1,
      frames: [],
      loading: true,
      loopPlayer: true,
      live: false,
      playerCurrentFrame: 0,
      sequences: sequences,
      selectedSequenceId: sequences[0].id
    }
  },
  created () {
    this.load()
  },
  computed: {
    currFrame () {
      return this.frames[this.currFrameIdx]
    }
  },
  methods: {
    load () {
      this.loading = false
      this.frames = [{
        enabled: true,
        movements: [{
          id: 'servo-id',
          start: 0,
          destAngle: 90,
          duration: 200,
          accel: 10,
          deaccel: 10
        },
          {
            id: 'servo-id',
            start: 0,
            destAngle: 92.3,
            duration: 100,
            accel: 10,
            deaccel: 10
          }]
      }]
      this.currFrameIdx = 0
    }
  }
}
</script>

<style lang="scss">
  .btn {
    margin: 0 0.1rem;
    border-radius: 0;
  }

  .movements table th {
    font-weight: bold;
    font-size: smaller;
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
