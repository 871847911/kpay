<template>
    <div id="login">
        <div class="login-out">
            <div class="login-dialog">
                <login-dialog></login-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import LoginDialog from '../login/LoginDialog'
export default {
  name: 'Login',
  components: {
    LoginDialog
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins'
#login
  height 100%
  background url(../../assets/image/login-bg.jpg)
  .login-out
    .logo
      width 1.6rem
      height auto
      position absolute
      left 0.37rem
      top 0.32rem
      img
        width 1.6rem
        height auto
    .login-dialog
      width 5.2rem
      height 5.2rem
      fixedCenter()
</style>
