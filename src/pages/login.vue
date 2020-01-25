<template>
  <q-page class="flex flex-center">

    
  <div class="q-pa-md" style="max-width: 300px">
    <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
      
      <q-input
        ref="username"
        filled
        v-model="username"
        label="Nick"
        hint="Nazwa użytkownika"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Proszę wprowadzić Nick']"
      />

      <q-input
        ref="password"
        filled
        type='password' 
        v-model="password"
        label="Hasło"
        hint=""
        lazy-rules
        :rules="[
          val => val && val.length > 0 || 'Proszę wprowadzić Hasło'
        ]"
      />

      <div>
        <q-btn label="Zaloguj" type="submit" color="primary" />
      </div>
    </form>
  </div>
    
    <div class="q-pa-md">
      <div class="q-gutter-md col items-start">

      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageLogin',
  data () {
    return {
      password: '',
      username: '',
    }
  },

  methods: {
    onSubmit () {
      this.$refs.username.validate()
      this.$refs.password.validate()

      if (this.$refs.username.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      }
      else {
        let body = new URLSearchParams();
        body.set('password', this.password);
        body.set('login', this.username);


        this.$axios.post('players', body, )
          .then((response) => {
              
              this.$q.sessionStorage.set('usernName', this.username)
              this.$q.sessionStorage.set('user_id', response.data.playerId)

              this.$router.push("/")
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
}
</script>
