<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
@import '~assets/styles/ele'
@import '~assets/styles/components'

#app
  height 100%
</style>
