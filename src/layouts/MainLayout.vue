<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <!-- <RestaurantSearch/> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" overlay bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8"> Navigation </q-item-label>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          exact
          :to="link.link"
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>
              {{ link.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: 'Map',
    caption: 'of Restaurants',
    icon: 'mdi-map',
    link: '/'
  },
  {
    title: 'List',
    caption: 'of Restaurants',
    icon: 'mdi-format-list-bulleted',
    link: '/list'
  },
  {
    title: 'Add',
    caption: 'New Restaurant',
    icon: 'mdi-format-list-bulleted',
    link: '/add'
  }
]

import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'
// import RestaurantSearch from '../components/RestaurantSearch.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    // RestaurantSearch
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const store = useStore()
    onMounted(() => {
      store.dispatch('GET_RESTAURANTS')
    })
    const $q = useQuasar()
    const title = $q.screen.width < 1023 ? 'ECP' : 'ECP Favorite Restaurants'
    return {
      title,
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
