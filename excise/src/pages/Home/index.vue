<template>
  <div>
      <TypeNav/>
      <ListContainer/>
      <Recommend/>
      <Like/>
      <Floor v-for="(Floor,index) in FloorList" :key="Floor.id" :list="Floor"/>
      <Brand/>
  </div>
</template>

<script>
import ListContainer  from '@/pages/Home/ListContainer'
import Recommend from '@/pages/Home/Recommend'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
import {mapState} from 'vuex'
export default {
  components:{
    ListContainer,
    Recommend,
    Like,
    Floor,
    Brand
  },
  computed:{
    ...mapState({
      FloorList:(state)=>state.home.FloorList
    })
  },
  mounted(){
    this.$store.dispatch('getFloorList')
  },
}
</script>

<style>

</style>