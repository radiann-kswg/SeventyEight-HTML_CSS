// https://qiita.com/helloworld193/items/9aed3870be1e739c3ad2 (改変済)
Vue.createApp({})
	.component("hamberger-menu", {
		template: `<!--ハンバーガーメニューのボタン-->
		<div class="hamburger_btn" v-on:click='ActiveBtn=!ActiveBtn'>
			<span class="line line_01" v-bind:class="{'btn_line01':ActiveBtn}"></span>
			<span class="line line_02" v-bind:class="{'btn_line02':ActiveBtn}"></span>
			<span class="line line_03" v-bind:class="{'btn_line03':ActiveBtn}"></span>
		</div>
		<!--サイドバー-->
		<transition name="sidebar">
			<div class="sidebar" v-show='ActiveBtn'>
				<ul>
					<li><a href="/index.html">TOP</a></li>
					<li><a href="/characters.html">キャラクター紹介</a></li>
					<li><a href="https://database.numbertales-radiann.net/">創作ガイドライン/Creation Guidelines</a></li>
					<li><a href="https://www.pixiv.net/users/44375569">原作者公式pixiv</a></li>
					<li><a href="https://radiann-kswg.fanbox.cc/">原作者公式pixivFANBOX</a></li>
					<li><a href="https://radiann-kswg.booth.pm/">原作者公式BOOTH</a></li>
				</ul>
			</div>
		</transition>`,
		data() {
			return {
				ActiveBtn: false,
			};
		},
	})
	.mount("#app-menu");
