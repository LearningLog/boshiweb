<template>
  <div>
    <div
      class="about"
      @mouseenter="isActive(true)"
      @mouseleave="isActive(false)"
    >
      <p class="contact">联系<br>我们</p>
    </div>
    <div class="aboutCont" v-show="active">
      <p>
        热线：<span>400-900-7025</span>
      </p>
      <hr class="line">
      <p>
        QQ群：<span>433765957</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'About',
  data() {
    return {
      active: false
    }
  },
  methods: {
    isActive(type) {
      if (type) {
        this.active = true
      } else {
        this.active = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .about {
    width: 70px;
    height: 130px;
    position: fixed;
    right: -10px;
    top: 65%;
    z-index: 10000;
    border-bottom-left-radius: 70px;
    border-top-left-radius: 70px;
    background: url('../../assets/images/aboutImg1.png') no-repeat 0 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: url('../../assets/images/aboutImg2.png') no-repeat 0 0;
    }

    .contact {
      width: 70px;
      height: auto;
      text-align: right;
      padding-right: 12px;
      line-height: 30px;
      color: #FFFFFF;
    }
  }

  .aboutCont {
    width: 180px;
    padding: 0 10px;
    border: 1px solid #e4e4e4;
    position: fixed;
    right: 80px;
    top: 67%;

    .line {
      border: 0.8px solid #e4e4e4;
    }

    span {
      color: #1799f7;
    }
  }
</style>
