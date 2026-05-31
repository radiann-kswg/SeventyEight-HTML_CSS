const customScrollComponent = {
  props: {
    horizontal: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  template: `
    <div class="block-scroll">
      <div class="scroll-content" v-bind:class="{'scroll-content--vertical': !horizontal}">
        <slot></slot>
      </div>
    </div>
  `,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-custom-scroll-root]").forEach((element) => {
    Vue.createApp({
      components: {
        "custom-scroll": customScrollComponent,
      },
    }).mount(element);
  });
});
