<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-6 col-sm-6 col-md-3">
          <div class="">
            <div v-if="loading" class="loading-msg">
              loading. please wait...
            </div>
            <h3>Sequences </h3>

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

          <b-btn variant="outline-primary">
            <font-awesome-icon icon="play" flip="horizontal"/>
          </b-btn>
          <b-btn variant="outline-primary">
            <font-awesome-icon icon="stop"/>
          </b-btn>
          <b-btn variant="outline-primary">
            <font-awesome-icon icon="play"/>
          </b-btn>

              <div v-for="(frameToggle, idx) in frameToggles" v-bind:key="idx">
                <div class="form-check custom-control custom-checkbox">
                  <input class="form-check-input position-static custom-control-input" type="checkbox" id="blankCheckbox" value="option1" aria-label="...">
                  {{idx}}
                </div>
                  <!--

                <b-form-checkbox v-model="frameToggles[idx]"
                                 value="true"
                                 unchecked-value="false"
                                 style="display:inline">{{idx}}
                </b-form-checkbox>
-->
              </div>

        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h4>Frame
            <div style="display:inline">
              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="chevron-left"/>
              </b-btn>
              <b-form-input v-model="currFrame"
                            type="text"
                            size="sm"
                            style="width:3rem; display:inline; text-align: center"></b-form-input>
              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="chevron-right"/>
              </b-btn>

              <b-btn size="sm" variant="outline-primary">
                <font-awesome-icon icon="plus-square"/>
              </b-btn>
            </div>

          </h4>
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
      currFrame: 1,
      frameToggles: [true, false, false, true, false],
      loading: true,
      sequences: sequences,
      selectedSequenceId: sequences[0].id
    }
  },
  created () {
    this.load()
  },
  computed: {},
  methods: {
    load () {
      this.loading = false
    }
  }
}
</script>
