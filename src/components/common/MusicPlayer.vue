<template>
   <div class="musicPlayer">
    <el-row>
      <el-col :span="0.5">
        <el-button 
          id="play"
          @click="play"
          :icon="music.isPlay?'icon-zantinganniu- iconfont':'icon-bofang iconfont'"
          circle
        >
        </el-button>
      </el-col>
      
      <el-col 
        :span="14"  
        style="padding-left: 10px;display:flex;flex-direction:column;justify-content:center;min-height:40px;max-width:684px;"
        >
        <p style="min-height:30px;">
          <span class="music-name">{{name === ""||name === undefined ? "暂未上传音频" : name}}</span>
          <span class="music-Size">{{music.newSize}}</span>
        </p>
        <el-slider
          @change="changeTime"
          :format-tooltip="formatTime"
          :max="music.maxTime"
          v-model="music.currentTime" 
          style="width: 100%;">
        </el-slider>
      </el-col>

      <el-col 
        :span="6" 
        style="padding: 25px 0px 0px 10px;color:#909399;font-size: 13px"
        >
        {{formatTime(music.currentTime)}}/{{formatTime(music.maxTime)}}
      </el-col>
    </el-row>

    <audio ref="music">
      <source :src="url" type="audio/mp3">
      <source :src="url" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      music: {
        isPlay: false,
        currentTime: 0,
        maxTime: 0,
        volume: 100,
        musicName: "",
        newSize: ""
      },
      playPromise: {}
    };
  },

  props: {
    name: {
      type: String
    },
    url: {
      type: String
    },
    size: {
      type: String
    }
  },

  mounted() {
    this.$nextTick(() => {
      setInterval(this.listenMusic, 1000);
    });
  },

  watch: {
    size(newValue, oldValue) {
      if (newValue) {
        this.music.newSize = newValue.indexOf("M") ? newValue : newValue + "MB";
      }
    },
    url() {
      this.$refs.music.load();
    }
  },

  methods: {
    listenMusic() {
      if (!this.$refs.music) {
        return;
      }
      if (this.$refs.music.readyState) {
        this.music.maxTime = this.$refs.music.duration;
      }
      this.music.isPlay = !this.$refs.music.paused;
      this.music.currentTime = this.$refs.music.currentTime;
    },

    play() {
      const audioRef = this.$refs.music;

      if (audioRef.paused) {
        this.playPromise = audioRef.play();
      } else {
        this.playPromise
          .then(res => {
            audioRef.pause();
          })
          .catch(err => {
            console.log(err);
          });
      }

      this.music.isPlay = !audioRef.paused;

      this.$nextTick(() => {
        document.getElementById("play").blur();
      });
    },

    changeTime(time) {
      if(isNaN(time) !== true){
        this.$refs.music.currentTime = time;
      }else{
        this.$refs.music.currentTime = 0
      }
    },

    formatTime(time) {
      if(isNaN(time) !== true){
        let it = parseInt(time);
        let m = parseInt(it / 60);
        let s = parseInt(it % 60);
  
        return (
          (m < 10 ? "0" : "") +
          parseInt(it / 60) +
          ":" +
          (s < 10 ? "0" : "") +
          parseInt(it % 60)
        );
      }else{
        return "00:00"
      }
    }
  }
};
</script>

<style lang="stylus">
.musicPlayer
  .icon-bofang
    display block
    font-size 0.11rem
    width 30px !important
    height 30px
    line-height 30px
    color #ffffff
    border-radius 50%
    background #6cddc7
  .icon-zantinganniu-
    display block
    font-size 0.11rem
    width 30px !important
    height 30px
    line-height 30px
    color #ffffff
    border-radius 50%
    background #6cddc7
  .el-slider__runway
    margin 0
  .el-slider__bar
    background-color #6cddc7 !important
  .music-Size
    height 17px
    font-size 12px
    font-family PingFangSC-Regular
    font-weight 400
    color rgba(155, 155, 155, 1)
    line-height 17px
  .music-name
    height 17px
    font-size 12px
    font-family PingFangSC-Regular
    font-weight 400
    color rgba(74, 74, 74, 1)
    line-height 17px
  .el-button.is-circle
    background rgba(238, 242, 243, 1)
    border none !important
    padding 7px !important
  .el-progress-bar__outer
    width 100% !important
    height 3px !important
  .percent .el-progress__text
    float right
    margin-top 11px
  .percent .el-progress-bar
    position relative
    width 4.59rem
    padding-right 0
  .upload
    width 150px
    height 40px
    background-color #6cddc7
    border-radius 20px
    color #ffffff
    margin-left 50px
  .el-progress-bar__inner
    background-color #6cddc7 !important
  .el-slider__button-wrapper .el-tooltip, .el-slider__button-wrapper after
    display none !important
  .el-slider__bar, .el-slider__runway
    height 3px
  .el-col-4
    width 6.66667%
</style>
