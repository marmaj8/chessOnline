<template>
    <form class="q-pa-md row" @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset">
        <q-btn label="Utwórz Grę" type="submit" color="primary" />
        <q-toggle v-model="priv" label="Prywatna"/>
        <q-input v-if="priv" v-model="password" filled type="password" label="Hasło" />
    </form>
</template>

<script>

export default {
  name: 'NewGame',
  data () {
    return {
      password: '',
      priv: false,
    }
  },

  methods: {
    onSubmit (){
        var body = {
            playerId: this.$q.sessionStorage.getItem('user_id'),
            anyoneCanJoin: !this.priv,
            password: this.password,
        }
        this.$axios.put('games', body, )
          .then((response) => {
              this.$router.push("/game?gameId="+response.data.createdGame)
          })
          .catch((error) => {

            if (error.response.status == 404)
            {
              this.$q.notify({
                color: 'negative',
                position: 'center',
                message: 'Brak połączenia z serwerem.\nProszę spróbować później.',
                icon: 'report_problem'
              })
            }
            else
            {
              this.$q.notify({
                color: 'negative',
                position: 'center',
                message: error.response.data.message,
                icon: 'report_problem'
              })
            }
          })
    }
  }
}
</script>
