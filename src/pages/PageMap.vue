<template>
  <q-page>
    <RestaurantSearch :map="map" />
    <div style="min-height: inherit" id="map"></div>
  </q-page>
</template>

<script>
import { Map, NavigationControl, GeolocateControl, Popup } from 'maplibre-gl'
import '../../node_modules/maplibre-gl/dist/maplibre-gl.css'
// import maptiler_street_style from '../../data/maptiler_street_style.json'
import restaurant_pin from '../assets/restaurant_pin.png'

import RestaurantSearch from '../components/RestaurantSearch.vue'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Map',
  components: {
    RestaurantSearch
  },
  data () {
    return {
      map: {},
      loaded: false
    }
  },

  mounted: async function () {
    this.initMap()
  },
  computed: {
    ...mapFields(['restaurants'])
  },
  watch: {
    // maplayerjson (newValue, oldValue) {
    //   this.setMapLayer()
    // }
  },
  methods: {
    initMap: function () {
      const map = (this.map = new Map({
        container: 'map',
        style:
          'https://api.maptiler.com/maps/4d8cab88-aff1-44d6-bf53-38f4fbbb1687/style.json?key=QyoptGwrlYh4i6RgsCDC', // maptiler_street_style,
        minzoom: 8,
        center: [-105, 39.75],
        zoom: 10
        // hash: process.env.NODE_ENV !== 'production'
      }))

      map.addControl(new NavigationControl(), 'top-right')
      // Add geolocate control to the map.
      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      )
      // Load the school pin icon.
      map.loadImage(restaurant_pin, function (error, image) {
        if (error) throw error
        map.addImage('restaurant_pin', image)
      })

      let hoveredFeatureId = null
      //Remove Highlighted feature when clicking off any feature
      map.on('click', () => {
        if (hoveredFeatureId !== null) {
          map.setFeatureState(
            { source: 'restaurants', id: hoveredFeatureId },
            { hover: false }
          )
        }
        hoveredFeatureId = null
      })

      //Loop through the three different layer types and run the hightlight and mouseover functions for each
      const allLayers = ['restaurants', 'restaurants-labels']
      allLayers.forEach(layer => {
        //   Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mousemove', layer, function () {
          map.getCanvas().style.cursor = 'pointer'
        })
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layer, function () {
          map.getCanvas().style.cursor = ''
        })

        map.on('click', layer, function (e) {
          if (e.features.length > 0) {
            if (hoveredFeatureId !== null) {
              map.setFeatureState(
                { source: 'restaurants', id: hoveredFeatureId },
                { hover: false }
              )
            }
            hoveredFeatureId = e.features[0].id
            map.setFeatureState(
              { source: 'restaurants', id: hoveredFeatureId },
              { hover: true }
            )
          }
          let coordinates = e.lngLat
          let p = e.features[0].properties
          let html = ''
          Object.entries(p).reduce((data, [key, value]) => {
            html += '<b>' + key + ':</b> ' + value + '</br>'
          }, {})

          new Popup({
            anchor: 'bottom',
            offset: [0, 0]
          })
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(map)
        })
      })

      map.on('load', () => {
        this.loaded = true
        map.addSource('restaurants', {
          type: 'geojson',
          data: this.restaurants,
          generateId: true
        })

        map.addLayer({
          id: 'restaurants',
          type: 'symbol',
          source: 'restaurants',
          layout: {
            'icon-image': 'restaurant_pin',
            'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 18, 1],
            visibility: 'visible',
            'icon-offset': [0, -5],
            'icon-ignore-placement': true,
            'icon-allow-overlap': true
          },
          filter: ['==', '$type', 'Point']
        })

        map.addLayer({
          id: 'restaurants-labels',
          type: 'symbol',
          source: 'restaurants',
          minzoom: 10.5,
          layout: {
            'text-font': ['literal', ['Arial Unicode MS Bold']],
            'text-field': ['get', 'Place'],
            'text-variable-anchor': ['left', 'right', 'top', 'bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            'text-size': ['interpolate', ['linear'], ['zoom'], 10, 9, 15, 14],
            'text-letter-spacing': 0.08,
            'text-max-width': 10,
            'text-padding': 5,
            'text-allow-overlap': ['step', ['zoom'], false, 12.5, true],
            'text-ignore-placement': false
          },
          paint: {
            'text-halo-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#34c9eb',
              '#f6f6f4'
            ],
            'text-color': 'rgba(13, 14, 14, 1)',
            'text-halo-width': 2,
            'text-halo-blur': 2
          }
        })
      })
    }

    // setMapLayer: function () {
    //   this.map.getSource('dpslayer').setData(this.maplayerjson)
    // }
  }
}
</script>
<style>
#map {
  min-height: 100vh;
}
.maplibregl-ctrl-compass .maplibregl-ctrl-icon {
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: 70%;
  height: 100%;
  margin: 0;
  width: 100%;
}
</style>
