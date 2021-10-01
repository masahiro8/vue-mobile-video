import Vue from "vue";
import Vuex from "vuex";
import { Products } from "./modules/Products";

Vue.use(Vuex);

export const Store = new Vuex.Store({
  modules: {
    Products,
  },
  strict: true,
});
