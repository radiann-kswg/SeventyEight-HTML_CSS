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

// 他の Vue アプリから custom-scroll を取り込めるようにするヘルパー
function registerCustomScrollTo(app) {
  app.component("custom-scroll", customScrollComponent);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#app-custom-scroll").forEach((element) => {
    const app = Vue.createApp({});
    registerCustomScrollTo(app);
    app.mount(element);
  });
});
