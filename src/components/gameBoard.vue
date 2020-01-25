<template>
    <div class="board q-pa-md fit">

        <div class="row no-wrap items-stretch text-center">
          <div class="col" v-for="letter in letters" v-bind:key="letter.value">
            {{letter}}
          </div>
        </div>

        <div class="row no-wrap items-stretch" v-bind:key="row.index" v-for="row in board.rows">
          <div class="col text-right">
            {{8-row.index}}
          </div>
          <div class="field col" v-bind:key="field.index" v-for="field in row.fields" :class="{
                'bg-red-3': field.selected && field.white,
                'bg-red-7': field.selected && !field.white,
                'bg-brown-3': !field.selected && field.white,
                'bg-brown-7': !field.selected && !field.white,
            }" @click="$emit('move', field.posX, field.posY)">
            <template v-if="field.piece === null">
              <span />
            </template>
            <template v-else>
              <img class="figure" v-bind:src="field.piece.figure" /> 
            </template>
          </div>
          <div class="col">
            {{8-row.index}}
          </div>
        </div>

        <div class="row no-wrap items-stretch text-center">
          <div class="col" v-for="letter in letters" v-bind:key="letter.value">
            {{letter}}
          </div>
        </div>
      
  </div>
</template>

<script>

export default {
  name: 'GameBoard',
  props: ['board','selected'],
  components: {
  },
  data () {
    return {
      numbers: [ 1,2,3,4,5,6,7,8 ],
      letters: [ ' ','A','B','C','D','E','F','G','H',' '],
    }
  },

  methods: {
    figure(piece) {
      var str = "~assets/"
      switch(piece.figure)
      {
        case 0:
          str += "pawn"
          break
        case 1:
          str += "horse"
          break
        case 2:
          str += "tower"
          break
        case 3:
          str += "bishop"
          break
        case 4:
          str += "queen"
          break
        case 5:
          str += "king"
          break
      }
      if(piece.white)
      {
        str += "W.svg"
      }
      else
      {
        str += "B.svg"
      }
      //console.log(str)
      return str
    },
  },
  computed: {
  }
}
</script>

<style scoped>
.field {
  position: relative;
  width: 50%;
}
.field:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.figure {
  position:absolute;
  height: 100%;
  width: 100%;
}
</style>