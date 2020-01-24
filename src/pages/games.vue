<template>
    <div id="q-app">
      <div v-if="this.$q.sessionStorage.getItem('usernName') === null">
        <LoginPanel />
      </div>
      <div v-else class="q-pa-md">
        <q-table
            title="Rozgrywki"
            :data="games"
            :columns="columns"
            row-key="_id"
            :pagination.sync="pagination"
        >
            <template v-slot:body="props">
            <q-tr :props="props" :class="{
                'bg-red-3': !props.row.anyoneCanJoin && (props.row.player1 !== null || props.row.player2 !== null),
                'bg-red-5': !props.row.anyoneCanJoin && (props.row.player1 !== null && props.row.player2 !== null),
                'bg-red-7': !props.row.anyoneCanJoin && props.row.started,
                'bg-green-3': props.row.anyoneCanJoin && (props.row.player1 !== null || props.row.player2 !== null),
                'bg-green-5': props.row.anyoneCanJoin && (props.row.player1 !== null && props.row.player2 !== null),
                'bg-green-7': props.row.anyoneCanJoin && props.row.started,
            }">
                <q-td v-for="col in cols" :key="col.name" :props="props">
                {{ props.row[col.field] }}
                </q-td>
                <q-td key="status" :props="props">
                    <div v-if="props.row.started">Rozgrywka</div>
                    <div v-else>Przygotowywanie</div>
                </q-td>
                <q-td key="type" :props="props">
                    <div v-if="props.row.anyoneCanJoin">Otwarta</div>
                    <div v-else>Zamknięta</div>
                </q-td>
                <q-td key="actions" :props="props">
                <q-btn round icon="play_arrow" color="primary" @click="enter(props.row._id)"/>
                </q-td>
            </q-tr>
            </template>
        </q-table>
        </div>
    </div>
</template>

<script>
import LoginPanel from "../components/LoginPanel";
import io from 'socket.io-client';

export default {
  name: 'PageGames',
  components: {
    LoginPanel,
  },
  data () {
    return {
      logged: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 20
        // rowsNumber: xx if getting data from a server
      },
        games: [],
      columns: [
        {
          name: "name",
          align: "center",
          label: "Nazwa",
          field: "name",
          sortable: true
        },
        {
          name: "player1",
          align: "center",
          label: "Gracz 1.",
          field: "player1",
          sortable: true
        },
        {
          name: "player2",
          align: "center",
          label: "Gracz 2.",
          field: "player2",
          sortable: true
        },
        {
          name: "status",
          align: "center",
          label: "Status",
          field: "started",
          sortable: true
        },
        {
          name: "type",
          align: "center",
          label: "Rodzaj",
          field: "anyoneCanJoin",
          sortable: true
        },
        {
          name: "actions",
          align: "center",
          label: "Akcja",
          sortable: true
        }
      ]
    }
  },

  mounted: function () {
    
      this.$socket = io('http://localhost:3000');
      const base = this


      this.$socket.on('gameChanged', function(game){
        var index
        var i = 0
        base.games.forEach(gg => {
          console.log(gg)
          if(gg._id == game._id){
            index = i
          }
          i++
        });
        base.games.splice(index,1)
        base.games.push(game)
      });

      this.$socket.on('gameWin', function(game){
        var index
        var i = 0
        base.games.forEach(gg => {
          console.log(gg)
          if(gg._id == game._id){
            index = i
          }
          i++
        });
        base.games.splice(index,1)
        base.games.push(game)
      });
      this.$socket.on('newGame', function(game){
        base.games.push(game)
      });

      this.$axios.get('games/')
      .then((response) => {
        this.games = response.data
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
    rowclick(vt, row) {
      this.$router.push("/game?id=" + row._id);
    },
    gameState: function (row) {
        var res = 0
        if (row.anyoneCanJoin)
        {
            if(!row.started) res = 1
            else if(row.player1 != null && row.player2 != null) res = 2
            else res = 3
        }
        else
        {
            if(!row.started) res = -1
            else if(row.player1 != null && row.player2 != null) res = -2
            else res = -3
        }
        console.log(res + " " + row.anyoneCanJoin + " " +row.started)
        return res
    },
    enter: function(id) {
      console.log(id)
      this.$router.push("/game?gameId="+id)
    },
    created() {
    }
  },
  computed: {
    cols () {
        var col = [];
        for (var i = 0; i < this.columns.length - 3; i++)
        {
            col.push(this.columns[i])
        }
        return col
    }
  },
}
</script>

<style>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body{
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.4;
}
.btn{
  display: inline-block;
  border: none;
  background: #fff;
  padding: 7px 12px;
  cursor: pointer;
}
.btn:hover{
  background: #dddddd;
}
</style>
