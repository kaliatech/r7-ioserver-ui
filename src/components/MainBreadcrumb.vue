<template>
  <div class="main-breadcrumb">
    <ol class="breadcrumb">
      <li :key="crumb.name" v-for="(crumb) in crumbs" class="breadcrumb-item">
        <router-link v-if="crumb.url" :to="crumb.url" :class="{active: crumb.active}">{{ crumb.name }}</router-link>
        <a v-else>{{ crumb.name }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'main-breadcrumb',
  data () {
    return {
      crumbs: []
    }
  },
  mounted: function () {
    this.updateBreadcrumb()
  },
  watch: {
    '$route': function () {
      this.updateBreadcrumb()
    }
  },
  methods: {
    updateBreadcrumb: function () {
      this.crumbs.length = 0

      var path = this.$route.path

      if (!path) {
        return
      }

      // Home
      this.crumbs.push({
        name: 'Home',
        url: path === '/' ? null : '/',
        active: path === '/'
      })

      // IoConns
      if (path === '/controllers') {
        this.crumbs.push({
          name: 'Controllers',
          active: true
        })
      }
      else if (path.startsWith('/controllers/')) {
        this.crumbs.push({
          name: 'Controllers',
          url: '/controllers'
        })
        this.crumbs.push({
          name: this.$route.params.id,
          active: true
        })
      }

      // ServosView
      if (path === '/servos') {
        this.crumbs.push({
          name: 'Servos',
          active: true
        })
      }
      else if (path.startsWith('/servos/')) {
        this.crumbs.push({
          name: 'Servos',
          url: '/servos'
        })
      }

      // System
      if (path === '/system/ioconns') {
        this.crumbs.push({
          name: 'System - IO',
          active: true
        })
      }
      else if (path.startsWith('/system/ioconns')) {
        this.crumbs.push({
          name: 'System - IO Connections',
          url: '/system/ioconns'
        })
      }
    }
  }

}
</script>

<style lang="scss">
  @import "../styles/app.scss";

  .breadcrumb {
    padding: 0.25em $spacer;
    font-size: $font-size-sm;
  }

</style>
