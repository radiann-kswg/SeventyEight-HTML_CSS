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
      <div class="list-comp-wide-image">
        <slot name="imagelink"></slot>
      </div>
      <div class="list-comp-wide-body">
        <div class="list-comp-title"><slot name="title"></slot></div>
        <slot></slot>
      </div>
    </div>
    <div v-else class="list-comp-card">
      <slot name="imagelink"></slot>
      <div class="list-comp-title"><slot name="title"></slot></div>
      <slot></slot>
    </div>
  `,
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#app-list-comp").forEach((element) => {
    Vue.createApp({
      components: {
        "list-comp": listCompComponent,
      },
    }).mount(element);
  });
});
