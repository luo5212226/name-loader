<template>
  <div>demo App</div>
</template>
<script>
export default {
  data() {
    return {
      containterID: 'RT_frame'
    }
  },
  watch: {
    $route(val) {
      this.containterID = val.path === '/login' ? 'RT_login' : 'RT_frame'
    }
  }
}
</script>
<style>
  
</style>