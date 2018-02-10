<template>
  <div>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <h1 class="display-3">R7-IO-Server</h1>
        <p>This is the user interface to the r7-io-server. It is used to set up device controllers and calibrate servos.</p>
        <!--<p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more »</a></p>-->
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h2>Controllers</h2>
          <div class="fixed-height">
            <p>Microcomputers, microprocessors, or dedicated IO boards. The server sends commands to IO controllers via USB, serial, Bluetooth, etc.</p>
          </div>
          <p><a class="btn btn-secondary" href="#" role="button">View »</a></p>
        </div>
        <div class="col-md-4">
          <h2>Servos</h2>
          <div class="fixed-height">
            <p>The servo motors. Positions are usually specified as PWM pulse counts with differing ranges of
              motions.</p>
          </div>
          <p><a class="btn btn-secondary" href="#" role="button">View »</a></p>
        </div>

        <div class="col-md-4">
          <h2>MotionEngine</h2>
          <div class="fixed-height">
            <p>Generic motion controls for moving servos in real-time or preset patterns.</p>
          </div>

          <p><a class="btn btn-secondary" href="#" role="button">View »</a></p>
        </div>

      </div>
<!--
      <div class="row">
        <div class="col-md-4">
          <h2>Settings</h2>
          <div class="fixed-height">
            <p>Miscellanous settings</p>
          </div>
          <p><a class="btn btn-secondary" href="#" role="button">Configure »</a></p>
        </div>
      </div>
-->
    </div> <!-- /container -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {}
  }
}
</script>

<style scoped>
  .fixed-height {
    height: 6em
  }
</style>
