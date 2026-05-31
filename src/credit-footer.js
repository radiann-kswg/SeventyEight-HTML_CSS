const footerCreditComponent = {
  template: `<a href="/index.html" class="a-link">TOPに戻る</a>
		<div class="license"><p xmlns:cc="http://creativecommons.org/ns#"
xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL"
href="https://www.numbertales-radiann.net/">100BeautiesLab.(百花繚乱研究所) Primary
Works/Creations</a> by <a rel="cc:attributionURL dct:creator"
property="cc:attributionName" href="https://www.numbertales-radiann.net/">RadianN_kswg(ラジアン/柏木主税)</a> is
licensed under <a
href="http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer"
style="display:inline-block;">CC BY-NC 4.0<img
style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img
style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img
style="height:22px!important;margin-left:3px;vertical-align:text-bottom;"
src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"></a></p></div>
		<div class="credits">
			<p>百花繚乱研究所（©ラジアン(柏木主税) 2021-{{nowYear}}）<br />Mail：radiann.kswg6631＠gmail.com　Discord：@radiann_kswg</p>
			<p><a class="a-p" href="https://database.numbertales-radiann.net/">創作ガイドライン/Creation Guidelines</a></p>
		</div>`,
  data() {
    return {
      nowYear: 2021,
    };
  },
  mounted() {
    const date = new Date();
    this.nowYear = date.getFullYear();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("#app-credit, [data-footer-credit-root]")
    .forEach((element) => {
      Vue.createApp({
        components: {
          "footer-credit": footerCreditComponent,
        },
      }).mount(element);
    });
});
