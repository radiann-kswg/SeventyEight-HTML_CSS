const characterPageComponent = {
	template: `
    <h1>キャラクター紹介</h1>
    <h2><slot name="title">(No Name)</slot></h2>
    <div class="background0">
      <div class="character-detail">
        <div class="character-detail-info">
          <p><slot><span class="p-bold">Coming Soon...</span></slot></p>
          <div class="background1">
            <p>
              <span class="p-bold">フルネーム</span>：<slot name="fullname">???</slot><br />
              <span class="p-bold">カード番号</span>：<slot name="cardnumber">???</slot>
            </p>
            <p>
              <span class="p-bold">アルカナ性別</span>：<slot name="gender">???</slot><br />
              <span class="p-bold">アルカナ種族</span>：<slot name="species">???</slot><br />
              <span class="p-bold">所属/役職</span>：<slot name="class">???</slot>
            </p>
            <slot name="additions"></slot>
          </div>
        </div>
        <div class="character-detail-image">
          <slot name="characterimage"></slot>
        </div>
      </div>
    </div>
	<p>
	<span class="p-bold">制作メンバー(敬称略)</span><br />
	キャラクターイラスト：<slot name="illustrator">REITO_KYUN♡(黎兎)</slot><br />
	背景・3D制作：喜雨(kiu/xiyue)<br />
	意匠デザイン：散狐アタスト, ラジアン(柏木主税)<br />
	フォントデザイン：ラジアン(柏木主税)<br />
	制作・企画：百花繚乱研究所(©ラジアン, 2021-2026)
	</p>
    <a href="/characters.html">
      <h2 class="h2-a-link">キャラクター一覧に戻る</h2>
    </a>
  `,
};

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("#app-character-page").forEach((element) => {
		Vue.createApp({
			components: {
				"character-page-comp": characterPageComponent,
			},
		}).mount(element);
	});
});
