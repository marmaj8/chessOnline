<template>
  <div class="q-pa-md" >
    <div class="row items-stretch text-center">
      <div class="col gameName">
      {{gameName}}
      </div>
    </div>
    <div class="row players">
        <div v-if="p1Move" class="col text-right text-red">
                {{player1}}
        </div>
        <div v-else class="col text-right">
                {{player1}}
        </div>

        <div class="col text-center">
            VS
        </div>

        <div v-if="p2Move" class="col text-left text-red">
                {{player2}}
        </div>
        <div v-else class="col text-left">
                {{player2}}
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'GameHeader',
  props: ['player1','player2','activeplayer','started','gameName'],
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    p1Move() {
      //console.log(this.activeplayer)
      if(this.started && this.activeplayer == 1) {
        return true
      }
      return false
    },
    p2Move () {
      if(this.started && this.activeplayer == 2) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
.players{
  font-size: x-large
}
.gameName{
  font-size: xx-large
}
</style>