<template>
  <div class="content-con">
    <div class="left-area" :style="{ backgroundColor: background}">
    </div>
    <div class="right-area">
      <div class="num">{{ num }}</div>
      <div class="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconCard',
  props: {
    background: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    num: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.content-con {
  width: 210px;
  height: 110px;
  display: flex;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 10%);
  border: 1px solid #f5f7f9;
  border-radius: 8px;
  background: #fff;
  .left-area{
    border: 1px solid #f5f7f9;
    border-radius: 8px 0 0 8px;
    width: 36%;
    height: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(45,140,240);
  }
  .right-area{
    width: 64%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .num {
      width: 100%;
      height: 70%;
      font-size: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
