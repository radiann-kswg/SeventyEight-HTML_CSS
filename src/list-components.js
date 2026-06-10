const listCompComponent = {
  props: {
    wideStyle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  template: `
    <div v-if="wideStyle" class="list-comp-wide">
      <div class="list-comp-img">
        <slot name="imagelink"></slot>
      </div>
      <div class="list-comp-wide-body">
        <div class="list-comp-title"><slot name="title"></slot></div>
        <slot></slot>
      </div>
    </div>
    <div v-else class="list-comp-card">
      <div class="list-comp-card-img">
        <slot name="imagelink"></slot>
      </div>
      <div class="list-comp-title"><slot name="title"></slot></div>
      <slot></slot>
    </div>
  `,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#app-list-comp").forEach((element) => {
    const app = Vue.createApp({});
    app.component("list-comp", listCompComponent);
    // custom-scroll.js が先に読み込まれていれば <custom-scroll> もこのアプリで使えるようにする
    if (typeof registerCustomScrollTo === "function") {
      registerCustomScrollTo(app);
    }
    app.mount(element);
  });
});
