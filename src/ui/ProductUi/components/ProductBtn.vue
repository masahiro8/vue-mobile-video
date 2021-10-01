<template>
  <button
    class="pdt-products-btn"
    :style="getStyle()"
    @click="$emit('onClick', product.id)"
  ></button>
</template>
<script>
  export default {
    props: {
      product: {
        type: Object,
      },
    },
    methods: {
      getStyle() {
        const { r, g, b } = this.product.stylesRgb[0];
        let style = `background-color: rgb(${r},${g},${b});`;
        return style;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .pdt-products-btn {
    width: 48px;
    height: 48px;
    margin: 0 2px;
    border: none;
    display: inline-block;
  }
</style>
