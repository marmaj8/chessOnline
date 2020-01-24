<template>
  <div id="q-app">
    <div class="q-pa-md max">
      <div v-if="this.$q.sessionStorage.getItem('usernName') === null">
        <LoginPanel v-on:log-in="login"/>
      </div>
      <div v-else>
          <GameHeader v-bind:gameName="game.name" v-bind:player1="game.player1" v-bind:player2="game.player2" v-bind:activeplayer="game.activePlayer" v-bind:started="game.started" />
          <GameBoard v-bind:board="board" v-bind:selected="selected" v-on:move="move"/>
      </div>
    </div>
  </div>
  
</template>

<script>
import io from 'socket.io-client';

import LoginPanel from "../components/LoginPanel";
import GameBoard from "../components/GameBoard";
import GameHeader from "../components/GameHeader";

export default {
  name: 'PageGame',
  components: {
      LoginPanel,
      GameBoard,
      GameHeader,
  },
  data () {
    return {
      logged: false,

      selected: {
        posX: -1,
        posY: -1
      },

      game: {
        _id: "",
        name: "",
        active: true,
        started: false,
        anyoneCanJoin: true,
        password: "",
        activePlayer: 0,
        white: 0,
        player1: "",
        player2: "",
        pieces: []
      },
      isConnected: false
    }
  },

  mounted: function () {
    
      this.$socket = io('http://localhost:3000');
      const base = this

      this.$socket.on('gameChanged-'+this.$route.query.gameId, function(game){ 
        console.log(game)
        //base.game = game
        base.game = game
        base.game.player2 = ""+game.player2
      });
      this.$socket.on('gameStarted-'+this.$route.query.gameId, function(game){ 
        base.game = game
        console.log("start")
      });
      this.$socket.on('gameMove-'+this.$route.query.gameId, function(game){ 
        base.game = game
        var player = game.player1
        if(game.activePlayer == 2) {player = game.player2}
        console.log("move")
      });
      this.$socket.on('gameWin-'+this.$route.query.gameId, function(game){ 
        base.game = game
        var player = game.player1
        if(game.activePlayer == 1) {player = game.player2}
        console.log("win")
      });

      this.$axios.get('games/'+this.$route.query.gameId)
      .then((response) => {
        this.game = response.data
      })
      .catch((error) => {
        console.log(error.response)
              this.$q.notify({
                color: 'negative',
                position: 'center',
                message: error.response.data.message,
                icon: 'report_problem'
              })
      this.$router.push("/games");
      })
  },
  methods: {
    created() {
    },
    login: function(){
      this.logged = true
    },
    move(posX, posY)
    {
      //console.log(posX + " " + posY)
      if(this.selected.posX == -1) { // wybierz
        var test = false
        this.game.pieces.forEach(piece => {
          if (piece.posX == posX && piece.posY == posY && !piece.captured){
            test = true;
          }
        })
        if(test){ // wybraon figure
          this.selected.posX = posX
          this.selected.posY = posY
        }
      }
      else if (this.selected.posX == posX && this.selected.posY == posY){ // odznacz
        this.selected.posX = -1;
        this.selected.posY = -1
      }
      else{ // rusz
        var body = {
          gameId: this.$route.query.gameId,
          playerId: this.$q.sessionStorage.getItem('user_id'),
          start: {
            x: this.selected.posX,
            y: this.selected.posY,
          },
          end: {
            x: posX,
            y: posY
          }
        }

        this.$axios.post('games/move', body, )
          .then((response) => {
        this.selected = { posX: -1, posY: -1}
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
    },
    figureSrc(piece) {
      var str = ""
      switch(piece.figure)
      {
        case 0:
          str = str.concat("pawn")
          break
        case 1:
          str = str.concat("horse")
          break
        case 2:
          str = str.concat("tower")
          break
        case 3:
          str = str.concat("bishop")
          break
        case 4:
          str = str.concat("queen")
          break
        case 5:
          str = str.concat("king")
          break
      }
      if(piece.color == 1)
      {
        str = str.concat("W")
      }
      else
      {
        str = str.concat("B")
      }
    var images = require.context('../assets/', false, /\.svg$/)
    return images('./' + str + ".svg")
      return image
    },
    joinGame(password){
      var body = {
        gameId: this.game._id,
        playerId: this.$q.sessionStorage.getItem('user_id'),
        password: password,
      }
      this.$axios.post('games/join', body)
          .then((response) => {
            this.game.started = true
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

    },
    startGame(){
      var body = {
        gameId: this.game._id,
        playerId: this.$q.sessionStorage.getItem('user_id'),
      }
      this.$axios.patch('games/start', body)
          .then((response) => {
            this.game.started = true
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

    },
    changePassword(status){
      var body = {
        gameId: this.game._id,
        playerId: this.$q.sessionStorage.getItem('user_id'),
        password: status.password,
        anyoneCanJoin: status.pub
      }

      this.$axios.patch('games/', body)
          .then((response) => {
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
    },
  },
  computed: {
    board () {
        var board = {
          rows: []
        }
        //var rows = [];
        for(var i = 0; i < 8; i++)
        {
          var row = {
            index: i,
            fields: []
          }
          for(var j = 0; j < 8; j++)
          {
            var field = {
              white: true,
              piece: null,
              posX: j+1,
              posY: 8 -i,
              selected: false
            }
            if (this.selected.posX == field.posX && this.selected.posY == field.posY ){
              field.selected = true
            }
            if ( (i + j)%2 ==1 ) {field.white = false }
            row.fields.push(field)
          }
          board.rows.push(row)
        }

        this.game.pieces.forEach(piece => {
            if (!piece.captured)
            {
              var pp = {
                white: true,
                figure: this.figureSrc(piece)
              }
              if (piece.color == 2) { pp.white=false }

              board.rows[8-piece.posY ].fields[piece.posX -1].piece = pp
            }
          })

        return board
    },
    myName(){
      return this.$q.sessionStorage.getItem('usernName')
    }
    
  },
}
</script>

<style scoped>
.max {
  max-width: 800px;
  margin-left: auto;
margin-right: auto;
}
</style>