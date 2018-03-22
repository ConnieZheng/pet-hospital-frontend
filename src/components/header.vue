<template>
  <div>
    <h1>
      header:{{username}}
    </h1>
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
      username: this.name
    }
  }
}
</script>
