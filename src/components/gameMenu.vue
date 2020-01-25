<template>
  <div v-if="isOwner" class="q-pa-md" >
    <div class="row">
        <q-btn class="col text-center" label="Start" @click="$emit('start')" color="primary" />
    </div>
    <div class="row">
      <q-toggle class="col" v-model="pub" label="Otwarta"/>
      <q-input class="col" v-if="!pub" v-model="password" filled type="password" label="Hasło" />
      <span v-else class="col"/>
      <q-btn class="col" label="Ustaw" @click="changePassword()" color="primary" />
    </div>
  </div>
  <div v-else class="q-pa-md">
    <div class="row" v-if="canJoin">
      <q-input class="col" v-if="!isPublic" v-model="password" filled type="password" label="Hasło" />
      <span v-else class="col"/>
      <q-btn class="col" label="Dołącz" @click="joinGame()" color="primary" />
    </div>
  </div>
</template>

<script>

export default {
  /*
  */
  name: 'GameMenu',
  props: ['player1','myName','player2','anyoneCanJoin'],
  components: {
  },
  data () {
    return {
      password: '',
      pub: false
    }
  },

  methods: {
    changePassword() {
      this.$emit('changePassword', {'pub':this.pub, 'password':this.password})
    },
    joinGame() {
      this.$emit('joinGame', this.password)
    },
  },
  computed: {
    isPublic(){
      if(this.anyoneCanJoin == true) {return true}
      return false
    },
    isOwner() {

      if(this.player1 === this.myName){
        return true
      }
      return false
    },
    canJoin() {
      if(this.player2 === null && this.player1 !== this.myName){
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
.field {
    display: flex;
    height: 100px;
}
</style>