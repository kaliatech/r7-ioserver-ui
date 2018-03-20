<template>
  <b-container fluid>
    <form>
      <div class="row">
        <div class="col-3">
          <label class="nowrap">Start Pulse</label><br/>
        </div>
        <div class="col-4 offset-1 text-center">
          <!-- https://github.com/xiaoluoboding/vue-number-spinner -->
          <label class="nowrap">Curr Pulse</label><br/>
        </div>
        <div class="col-3 offset-1 text-right">
          <label class="nowrap">Stop Pulse</label><br/>
        </div>
      </div>

      <div class="form-row">
        <div class="col-2">
          <input class="form-control form-control-sm" v-model.number.lazy="servoFbo.startPulse" type="number"
                 @change="onUpdate"/>
        </div>
        <div class="col-1 nowrap">
          <b-button size="xs" variant="outline-secondary">
            <font-awesome-icon icon="chevron-up"/>
          </b-button>
          <b-button size="xs" variant="outline-secondary">
            <font-awesome-icon icon="chevron-down"/>
          </b-button>
        </div>
        <div class="col-2 offset-2 text-center">
          <input class="form-control form-control-sm" v-model.number.lazy="sliderVal" type="number"/>
        </div>
        <div class="col-1 offset-2 nowrap text-right">
          <b-button size="xs" variant="outline-secondary">
            <font-awesome-icon icon="chevron-up"/>
          </b-button>
          <b-button size="xs" variant="outline-secondary">
            <font-awesome-icon icon="chevron-down"/>
          </b-button>
        </div>
        <div class="col-2 text-right">
          <input class="form-control form-control-sm" v-model.number.lazy="servoFbo.endPulse" type="number"
                 @change="onUpdate"/>
        </div>
      </div>

      <div class="form-row">
        <div class="col-12">
          <vue-slider v-if="modalShown"
                      v-model="sliderVal"
                      :min="servoFbo.startPulse"
                      :max="servoFbo.endPulse"
                      tooltip="false"
          ></vue-slider>
        </div>
      </div>

      <div class="form-row">
        <div class="col-2">
          <input class="form-control form-control-sm" v-model.number.lazy="servoFbo.startDeg" type="number"
                 @change="onUpdate"/>
        </div>
        <div class="col-2 offset-3  text-center">
          {{ currDeg }}
        </div>
        <div class="col-2 offset-3">
          <input class="form-control form-control-sm" v-model.number.lazy="servoFbo.endDeg" type="number"
                 @change="onUpdate"/>
        </div>
      </div>

      <div class="form-row">
        <div class="col-3">
          <label class="nowrap">Start Deg</label><br/>
        </div>
        <div class="col-4 offset-1 text-center">
          <label class="nowrap">Curr Deg</label><br/>
        </div>
        <div class="col-3 offset-1 text-right">
          <label class="nowrap">Stop Deg</label><br/>
        </div>
      </div>

      <div class="form-row">
        <div class="col-4 offset-4">
          <div class="form-check  text-center">
            <input type="checkbox" class="form-check-input" id="isLive" v-model="isLive">
            <label class="form-check-label" for="isLive">Live</label>
          </div>
        </div>
      </div>

      <!--<div class="btn-group btn-group-toggle" data-toggle="buttons">-->
      <!--<label class="btn btn-secondary" :class="isLive ? 'active' : ''" style="width:5em">-->
      <!--<input type="radio" name="options" id="option1" autocomplete="off">Live-->
      <!--</label>-->
      <!--<label class="btn btn-secondary" :class="!isLive ? 'active' : ''" style="width:5em">-->
      <!--<input type="radio" name="options" id="option2" autocomplete="off">Offline-->
      <!--</label>-->
      <!--</div>-->

    </form>
  </b-container>

</template>

<script>
// https://nightcatsama.github.io/vue-slider-component
import vueSlider from 'vue-slider-component'

import ioSrvr from '@/shared/IoServerService'
import nSrvc from '@/shared/NotificationService'

export default {
  name: 'servo-calibrate-controls',
  components: {
    'vue-slider': vueSlider
  },
  // model: {
  //   prop: 'servo',
  //   event: 'input'
  // },
  props: {
    servo: {type: Object},
    modalShown: {type: Boolean, default: true}
  },
  data () {
    return {
      // servoFbo: {startPulse: 0, endPulse: 100, initPulse: 50, startDeg: 0, endDeg: 100},
      servoFbo: JSON.parse(JSON.stringify(this.servo)),
      // sliderVal: (this.servo.endPulse - this.servo.startPulse) / 2
      sliderVal: this.servo.initPulse,
      isLive: false,
      nextPulseToSend: null,
      currPulseBeingSent: null
    }
  },
  computed: {
    currPulse () {
      return this.servoFbo.startPulse + this.sliderP * (this.servoFbo.endPulse - this.servoFbo.startPulse)
    },
    currDeg () {
      const deg = this.servoFbo.startDeg + this.sliderP * (this.servoFbo.endDeg - this.servoFbo.startDeg)
      return Number(Math.round(deg + 'e2') + 'e-2').toFixed(2) // https://stackoverflow.com/a/32178833/123378
    },
    sliderP () {
      return (this.sliderVal - this.servoFbo.startPulse) / (this.servoFbo.endPulse - this.servoFbo.startPulse)
    }
  },
  watch: {
    servo (newServo, oldServo) {
      if (newServo) {
        this.servoFbo = JSON.parse(JSON.stringify(this.servo))
        this.sliderVal = this.currPulse
      }
    },
    currPulse (newVal, oldVal) {
      this.nextPulseToSend = this.currPulse
      if (this.isLive) {
        if (this.currPulseBeingSent == null) {
          this.sendPulses()
        }
      }
    }
    // servoFbo: {
    //   handler: function (val, oldVal) {
    //     console.log('watch, servoFbo')
    //     // this.$emit('input', this.servoFbo)
    //     this.$emit('update:servo', val)
    //   },
    //   deep: true
    // }
  },
  methods: {
    onUpdate () {
      this.$emit('update:servo', this.servoFbo)
    },
    sendPulses () {
      this.currPulseBeingSent = this.nextPulseToSend
      this.nextPulseToSend = null
      ioSrvr.moveByPulse(this.servo.id, this.currPulseBeingSent)
        .then(() => {
          this.currPulseBeingSent = null
          if (this.nextPulseToSend != null) {
            this.sendPulses()
          }
        })
        .catch((err) => {
          this.currPulseBeingSent = null
          nSrvc.errored('Error', 'Network error sending movement commands. Msg: ' + err.message)
        })
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

  .btn-xs, .btn-group-xs > .btn {
    padding: 0.15rem 0.15rem;
    font-size: 0.475rem;
    line-height: 1.5;
    border-radius: 0.1rem;
  }
</style>
