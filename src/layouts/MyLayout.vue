<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn stretch flat label="Lista Gier" type="a" href="#/games"/>
        
        <q-toolbar-title>
          <span/>
        </q-toolbar-title>

        <div>{{this.$q.sessionStorage.getItem('usernName')}}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
    }
  }
}
</script>
