import axios from "axios";
import { getField, updateField } from "vuex-map-fields";
import { sheets2geojson } from "sheets2geojson";

export default {
  state: {
    restaurants: {
      type: "FeatureCollection",
      features: [], // <--- no features
    },
  },
  mutations: {
    updateField,
    SET_RESTAURANTS(state, restaurants) {
      state.restaurants = restaurants;
    },
  },
  actions: {
    async GET_RESTAURANTS({ commit }) {
      try {
        const response = await sheets2geojson(
          "2PACX-1vQ5vPkMuJUgkXrYTo2IG_DesuRNbWPJPR4e9ThvLdbZ5r_L0QXqg_xI16sOfcqxa5k-u31fMFwYVyyj",
          // "2PACX-1vSukUBxr03YDcVkdZber6EGTy7Sw5PQLl-xFZ_rg49nE1gsSMdSPidzyncZzT6B7zGMfXnJNB1CHZS-", WHERE IS THIS FROM???
          /* optional */ {
            latitudeColumn: "Latitude",
            longitudeColumn: "Longitude",
          }
        );
        commit("SET_RESTAURANTS", response);
      } catch (error) {
        alert(error);
      }
    },
  },
  getters: {
    getField,
    getRestaurantNames: (state) => {
      return state.restaurants.features.map((restaurant) => {
        return {
          label: restaurant.properties["Place"],
          value: restaurant.geometry.coordinates,
        };
      });
    },
  },
};
