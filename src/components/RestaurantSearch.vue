<template>
  <q-select
    clearable
    hide-bottom-space
    use-input
    hide-selected
    fill-input
    class="restaurant_search"
    bg-color="white"
    rounded
    outlined
    v-model="selectedRestaurant"
    input-debounce="5"
    label="Favorites"
    :options="restaurantOptions"
    @filter="filterRestaurants"
    style="width: 300px"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RestaurantSearch',
  props: {
    map: { type: Object }
  },
  data () {
    return {
      restaurantOptions: [],
      selectedRestaurant: null
    }
  },
  computed: {
    ...mapGetters(['getRestaurantNames'])
  },
  watch: {
    selectedRestaurant (newValue) {
      if (!newValue) return
      this.map.flyTo({
        center: newValue.value,
        zoom: 15,
        speed: 10
      })
    }
  },
  methods: {
    filterRestaurants (val, update, abort) {
      this.restaurantOptions = this.getRestaurantNames
      update(() => {
        const needle = val.toLowerCase()
        this.restaurantOptions = this.getRestaurantNames.filter(v => {
          return v.label.toLowerCase().indexOf(needle) > -1
        })
      })
    }
  }
}
</script>
<style scoped>
.restaurant_search {
  display: block;
  top: 10px;
  position: absolute;
  left: 10px;
  z-index: 1;
}
</style>
