<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="dark">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/"><img src="static/iconmonstr-layer-21.svg" width="30" height="30" class="mr-2"
                                  style="fill: white" alt="">
        IO Server
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item to="/controllers">Controllers</b-nav-item>
          <b-nav-item href="#">Servos</b-nav-item>
          <b-nav-item href="#">Motion</b-nav-item>
          <b-nav-item href="#">Settings</b-nav-item>
        </b-navbar-nav>
        <!--
                &lt;!&ndash; Right aligned nav items &ndash;&gt;
                <b-navbar-nav class="ml-auto">

                  <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                  </b-nav-form>

                  <b-nav-item-dropdown text="Lang" right>
                    <b-dropdown-item href="#">EN</b-dropdown-item>
                    <b-dropdown-item href="#">ES</b-dropdown-item>
                    <b-dropdown-item href="#">RU</b-dropdown-item>
                    <b-dropdown-item href="#">FA</b-dropdown-item>
                  </b-nav-item-dropdown>

                  <b-nav-item-dropdown right>
                    &lt;!&ndash; Using button-content slot &ndash;&gt;
                    <template slot="button-content">
                      <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item href="#">Signout</b-dropdown-item>
                  </b-nav-item-dropdown>
                </b-navbar-nav>
        -->

      </b-collapse>
    </b-navbar>
    <main-breadcrumb v-if="$route.path !== '/'"/>

    <main role="main">

      <router-view/>
      <vue-progress-bar></vue-progress-bar>
      <!--<hr>-->

    </main>

    <!--
        <footer class="container-fluid">
          <p>&copy; 2018 by Josh Sanderson</p>
        </footer>
    -->

  </div>
</template>

<script>
import MainBreadCrumb from '@/components/MainBreadcrumb'

export default {
  components: {'main-breadcrumb': MainBreadCrumb},
  data: function () {
    return {}
  },
  name: 'App'
}
</script>

<!--<style lang="stylus">
  import 'node_modules/izitoast/src/css/style.styl';
</style>-->

<style lang="scss">
  @import 'styles/app';

  #app {
  }
</style>
