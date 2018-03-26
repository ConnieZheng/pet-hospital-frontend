<template>
  <div>
    <!-- 逻辑完善，未测试过api，未引入elementui -->
    <h1>prop:name = {{name}}</h1>
    <h1>data:localname = {{localname}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    auth: String
  },
  data () {
    return {
      localname: this.name
    }
  }
}
</script>
