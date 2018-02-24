<template>
  <b-modal :title="'Calibrate: ' + servo.id"
           v-model="modalVisible"
           size="lg"
           @shown="onShown"
           @hidden="onHidden"
           @ok="save"
           :ok-title="okTitle">

    <!--@shown="showSlider=true"-->

    <servo-calibrate-controls
      v-if="servoFbo"
      :servo.sync="servoFbo"
      :modalShown="modalShown"
    />

  </b-modal>
</template>

<script>
import servoCalCtrls from '@/components/ServoCalibrateControls'

// import ioSrvr from '@/shared/IoServerService'
// import nSrvc from '@/shared/NotificationService'

export default {
  name: 'servo-calibrate-modal',
  components: {
    'servo-calibrate-controls': servoCalCtrls
  },
  props: {
    okTitle: {type: String, default: 'Apply'},
    servo: {type: Object},
    showModal: {type: Boolean, default: false}
  },
  data () {
    return {
      servoFbo: JSON.parse(JSON.stringify(this.servo)),
      modalVisible: false,
      modalShown: false
    }
  },
  mounted () {
    if (this.showModal === true) {
      this.modalVisible = true
    }
  },
  watch: {
    showModal: function (visible) {
      if (visible) {
        this.servoFbo = JSON.parse(JSON.stringify(this.servo))
      }
      this.modalVisible = visible
    }
  },
  methods: {
    onShown () {
      this.modalShown = true
    },
    onHidden () {
      this.$emit('hidden')
      this.modalShown = false
    },
    save (evt) {
      evt.preventDefault()
      this.$emit('saved', this.servoFbo)
      this.modalVisible = false
    }
  }
}
</script>
