<template>
  <div>
    <p>
      header:{{username}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    auth: Number
  },
  data () {
    return {
      username: this.name
    }
  }
}
</script>
