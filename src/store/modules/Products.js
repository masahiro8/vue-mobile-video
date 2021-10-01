import Vue from "vue";
import Vuex from "vuex";
import { api } from "@/api/api";

Vue.use(Vuex);

const API = api();

export const Products = {
  namespaced: true,

  state: {
    data: {},
    selectedCategory: null,
    selectedProduct: {
      categoryKey: null,
      productId: null,
    },
  },

  mutations: {
    SET_DATA(state, payload) {
      state.data = payload;
    },
    SET_CATEGORY(state, payload) {
      state.selectedCategory = payload;
    },
    SET_PRODUCT(state, payload) {
      state.selectedProduct = payload;
    },
  },

  actions: {
    // データ取得
    async load({ commit }, payload) {
      const data = await API.getData(payload);
      commit("SET_DATA", data);
    },

    // カテゴリ選択
    selectCategory({ commit }, { category_id }) {
      commit("SET_CATEGORY", category_id);
    },

    // プロダクト選択
    selectProduct({ commit }, { categoryKey, productId }) {
      commit("SET_PRODUCT", { categoryKey, productId });
    },
  },

  getters: {
    getData: (state) => {
      return state.data;
    },
    getCategoryProducts: (state) => (key) => {
      if (!key) return [];
      return state.data[key]["products"].filter((item) => item);
    },
    getCategoryArray: (state) => {
      return Object.keys(state.data).map((key) => {
        return { key, ...state.data[key] };
      });
    },
    getProduct: (state) => {
      if (!state.selectedProduct.categoryKey) return null;
      const products = state.data[state.selectedProduct.categoryKey][
        "products"
      ].filter((item) => item);
      const p = products.find(
        (item) => item.id === state.selectedProduct.productId
      );
      return p;
    },
  },
};
