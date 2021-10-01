<template>
  <div class="pdt-products-ui">
    <!-- プロダクト情報 -->
    <div class="pdt-info" v-if="productInfo">
      <a :href="productInfo.url" class="pdt-info-name">
        {{ productInfo.name }}
      </a>
    </div>
    <!-- プロダクト選択 -->
    <div class="pdt-products-list">
      <ProductBtn
        v-for="(product, index) in getProducts"
        :key="index"
        :product="product"
        @onClick="onSelectProduct"
      />
    </div>
    <!-- カテゴリ選択 -->
    <div class="pdt-category-list">
      <button
        class="pdt-category-btn"
        v-for="category in categoryList"
        :key="category.id"
        @click="selectCategory = category.key"
      >
        {{ category.info.title }}
      </button>
    </div>
  </div>
</template>
<script>
  import ProductBtn from "./components/ProductBtn.vue";
  import { Store } from "@/store/Store";
  export default {
    data: () => {
      return {
        productInfo: null,
        products: [],
        selectCategory: null,
        selectProduct: null,
      };
    },
    components: {
      ProductBtn,
    },
    computed: {
      getProducts() {
        return Store.getters["Products/getCategoryProducts"](
          this.selectCategory
        );
      },
      categoryList() {
        return Store.getters["Products/getCategoryArray"];
      },
    },
    mounted() {
      this.$watch(
        () => Store.getters["Products/getProduct"],
        (pdt) => {
          this.productInfo = pdt;
        },
        {
          deep: true,
        }
      );
    },
    methods: {
      onSelectProduct(id) {
        Store.dispatch("Products/selectProduct", {
          categoryKey: this.selectCategory,
          productId: id,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/valiables.scss";

  .pdt-info {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
  }

  .pdt-info-name {
    font-size: 12px;
    color: $color_products_name-text;
    text-align: center;
  }

  .pdt-products-ui {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 160px;
    width: 100%;
    background-color: $color_products_ui_background;
    z-index: 999;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
  }

  .pdt-category-list {
    height: 32px;
    width: 100%;
    overflow: auto;
    white-space: nowrap;
    position: absolute;
    bottom: 12px;
    left: 0;
  }

  .pdt-category-btn {
    font-size: 16px;
    height: 32px;
    padding: 4px 16px;
    margin: 0 8px;
    box-sizing: border-box;
    border: none;
    border-radius: 16px;
    color: $color_products_category_btn_text;
    background-color: $color_products_category_btn_background;
  }

  .pdt-products-list {
    height: 48px;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    position: absolute;
    bottom: 56px;
    left: 0;
  }
</style>
