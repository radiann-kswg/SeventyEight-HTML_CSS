// Cloudflare Turnstile (managed siteverify Worker) 経由でBot対策後、
// Formspreeへタロットカード作画メンバー応募内容を送信するフォーム。
const TURNSTILE_SITE_KEY = "0x4AAAAAADxuV3bJjkSQTDS-";
const TURNSTILE_WORKER_URL =
	"https://turnstile-siteverify-radiann-website.radiannkswg-mcp.workers.dev";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgyylrb";

const NAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 100;
const PORTFOLIO_MAX_LENGTH = 200;
const MESSAGE_MAX_LENGTH = 1000;

window.onloadTurnstileCallback = function () {
	document.dispatchEvent(new CustomEvent("tarot-turnstile-loaded"));
};

const tarotRecruitmentFormComponent = {
	template: `<form class="recruitment-form" v-on:submit.prevent="handleSubmit" novalidate>
		<div class="form-security-notice secure-connection">
			<p>このフォームはSSL暗号化通信とBot対策を利用して送信されます。</p>
		</div>

		<div class="recruitment-form-row">
			<div class="form-group">
				<label for="recruitment-name">お名前 <span class="required-mark">*</span></label>
				<input
					type="text"
					id="recruitment-name"
					v-model.trim="formData.name"
					v-bind:maxlength="nameMaxLength"
					placeholder="柏木主税"
					v-bind:class="{'input-error': errors.name}"
					v-bind:disabled="isSubmitting"
				/>
				<p class="form-error" v-if="errors.name">{{ errors.name }}</p>
			</div>

			<div class="form-group">
				<label for="recruitment-email">メールアドレス <span class="required-mark">*</span></label>
				<input
					type="email"
					id="recruitment-email"
					v-model.trim="formData.email"
					v-bind:maxlength="emailMaxLength"
					placeholder="your@email.com"
					v-bind:class="{'input-error': errors.email}"
					v-bind:disabled="isSubmitting"
				/>
				<p class="form-error" v-if="errors.email">{{ errors.email }}</p>
			</div>
		</div>

		<div class="form-group">
			<label for="recruitment-role">希望担当 <span class="required-mark">*</span></label>
			<select
				id="recruitment-role"
				v-model="formData.role"
				v-bind:class="{'input-error': errors.role}"
				v-bind:disabled="isSubmitting"
			>
				<option value="">希望担当を選択してください</option>
				<option value="character-illustration">キャラクターイラスト（必須枠）</option>
				<option value="background-3d">遠景・小道具3Dモデリング（歓迎枠）</option>
				<option value="both">両方対応可能</option>
				<option value="other">その他（備考に記載）</option>
			</select>
			<p class="form-error" v-if="errors.role">{{ errors.role }}</p>
		</div>

		<div class="form-group">
			<label for="recruitment-portfolio">ポートフォリオURL（任意）</label>
			<input
				type="url"
				id="recruitment-portfolio"
				v-model.trim="formData.portfolioUrl"
				v-bind:maxlength="portfolioMaxLength"
				placeholder="https://example.com/portfolio"
				v-bind:class="{'input-error': errors.portfolioUrl}"
				v-bind:disabled="isSubmitting"
			/>
			<p class="form-error" v-if="errors.portfolioUrl">{{ errors.portfolioUrl }}</p>
		</div>

		<div class="form-group">
			<label for="recruitment-message">応募メッセージ <span class="required-mark">*</span></label>
			<textarea
				id="recruitment-message"
				rows="6"
				v-model="formData.message"
				v-bind:maxlength="messageMaxLength"
				placeholder="ご経験、作風が分かる情報、参加への意欲などをご記入ください。"
				v-bind:class="{'input-error': errors.message}"
				v-bind:disabled="isSubmitting"
			></textarea>
			<p class="char-counter">{{ formData.message.length }} / {{ messageMaxLength }}</p>
			<p class="form-error" v-if="errors.message">{{ errors.message }}</p>
		</div>

		<div class="form-group">
			<label class="checkbox-label">
				<input
					type="checkbox"
					v-model="formData.privacyAccepted"
					v-bind:disabled="isSubmitting"
				/>
				この応募内容の送信・保管に同意します <span class="required-mark">*</span>
			</label>
			<p class="form-error" v-if="errors.privacyAccepted">{{ errors.privacyAccepted }}</p>
		</div>

		<div class="turnstile-container" ref="turnstileContainer"></div>
		<p class="form-error" role="alert" v-if="turnstileError">認証チェックが完了していません。チェックボックスにチェックしてから、もう一度送信してください。</p>

		<div class="error-alert" role="alert" v-if="submitFailed">
			<p>送信に失敗しました。時間をおいて再度お試しください。</p>
			<button type="button" class="a-link" v-on:click="submitFailed = false">閉じる</button>
		</div>

		<button type="submit" class="submit-button" v-bind:disabled="isSubmitting">
			<span v-if="isSubmitting" class="loading-spinner"></span>
			<span>{{ isSubmitting ? '送信中...' : '応募内容を送信する' }}</span>
		</button>
	</form>

	<div class="modal-overlay" v-if="submitSucceeded">
		<div class="modal-content success-message">
			<h2 class="contact-title">送信ありがとうございました</h2>
			<p>応募内容を受け付けました。確認のうえ、必要に応じてご連絡いたします。</p>
			<button type="button" class="submit-button" v-on:click="submitSucceeded = false">閉じる</button>
		</div>
	</div>`,
	data() {
		return {
			formData: {
				name: "",
				email: "",
				role: "",
				portfolioUrl: "",
				message: "",
				privacyAccepted: false,
			},
			errors: {},
			isSubmitting: false,
			submitSucceeded: false,
			submitFailed: false,
			turnstileToken: "",
			turnstileWidgetId: null,
			turnstileError: false,
			nameMaxLength: NAME_MAX_LENGTH,
			emailMaxLength: EMAIL_MAX_LENGTH,
			portfolioMaxLength: PORTFOLIO_MAX_LENGTH,
			messageMaxLength: MESSAGE_MAX_LENGTH,
		};
	},
	mounted() {
		if (window.turnstile) {
			this.renderTurnstile();
		} else {
			document.addEventListener("tarot-turnstile-loaded", this.renderTurnstile, {
				once: true,
			});
		}
	},
	beforeUnmount() {
		if (window.turnstile && this.turnstileWidgetId !== null) {
			window.turnstile.remove(this.turnstileWidgetId);
		}
	},
	methods: {
		validateForm() {
			this.errors = {};
			let valid = true;
			const name = this.formData.name.trim();
			const email = this.formData.email.trim();
			const role = this.formData.role;
			const portfolioUrl = this.formData.portfolioUrl.trim();
			const message = this.formData.message.trim();

			if (!name) {
				this.errors.name = "お名前は必須です";
				valid = false;
			} else if (name.length > NAME_MAX_LENGTH) {
				this.errors.name = `${NAME_MAX_LENGTH}文字以内で入力してください`;
				valid = false;
			}

			if (!email) {
				this.errors.email = "メールアドレスは必須です";
				valid = false;
			} else if (email.length > EMAIL_MAX_LENGTH) {
				this.errors.email = `${EMAIL_MAX_LENGTH}文字以内で入力してください`;
				valid = false;
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				this.errors.email = "有効なメールアドレスを入力してください";
				valid = false;
			}

			if (!role) {
				this.errors.role = "希望担当を選択してください";
				valid = false;
			}

			if (portfolioUrl && portfolioUrl.length > PORTFOLIO_MAX_LENGTH) {
				this.errors.portfolioUrl = `${PORTFOLIO_MAX_LENGTH}文字以内で入力してください`;
				valid = false;
			}

			if (portfolioUrl) {
				try {
					new URL(portfolioUrl);
				} catch {
					this.errors.portfolioUrl = "有効なURLを入力してください";
					valid = false;
				}
			}

			if (!message) {
				this.errors.message = "応募メッセージは必須です";
				valid = false;
			} else if (message.length > MESSAGE_MAX_LENGTH) {
				this.errors.message = `${MESSAGE_MAX_LENGTH}文字以内で入力してください`;
				valid = false;
			}

			if (!this.formData.privacyAccepted) {
				this.errors.privacyAccepted = "送信・保管への同意が必要です";
				valid = false;
			}

			return valid;
		},

		renderTurnstile() {
			if (!window.turnstile || !this.$refs.turnstileContainer) return;
			this.turnstileWidgetId = window.turnstile.render(this.$refs.turnstileContainer, {
				sitekey: TURNSTILE_SITE_KEY,
				action: "turnstile-spin-v1",
				callback: (token) => {
					this.turnstileToken = token;
					this.turnstileError = false;
				},
				"error-callback": () => {
					this.turnstileToken = "";
				},
				"expired-callback": () => {
					this.turnstileToken = "";
				},
			});
		},

		resetTurnstile() {
			this.turnstileToken = "";
			if (window.turnstile && this.turnstileWidgetId !== null) {
				window.turnstile.reset(this.turnstileWidgetId);
			}
		},

		async verifyTurnstile() {
			const response = await fetch(TURNSTILE_WORKER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: this.turnstileToken }),
			});
			const data = await response.json();
			return !!data.success;
		},

		async submitToFormspree() {
			const response = await fetch(FORMSPREE_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"X-Requested-With": "XMLHttpRequest",
				},
				mode: "cors",
				credentials: "omit",
				referrerPolicy: "strict-origin-when-cross-origin",
				body: JSON.stringify({
					name: this.formData.name.trim(),
					email: this.formData.email.trim(),
					subject: "tarot-recruitment",
					role: this.formData.role,
					portfolioUrl: this.formData.portfolioUrl.trim(),
					message: this.formData.message.trim(),
					sourcePage: window.location.href,
				}),
			});
			return response.ok;
		},

		resetForm() {
			this.formData = {
				name: "",
				email: "",
				role: "",
				portfolioUrl: "",
				message: "",
				privacyAccepted: false,
			};
			this.errors = {};
		},

		async handleSubmit() {
			this.submitFailed = false;

			if (!this.validateForm()) {
				return;
			}

			if (!this.turnstileToken) {
				this.turnstileError = true;
				return;
			}
			this.turnstileError = false;

			this.isSubmitting = true;
			try {
				const verified = await this.verifyTurnstile();
				if (!verified) {
					this.turnstileError = true;
					this.resetTurnstile();
					return;
				}

				const sent = await this.submitToFormspree();
				if (!sent) {
					throw new Error("formspree submission failed");
				}

				this.resetForm();
				this.resetTurnstile();
				this.submitSucceeded = true;
			} catch (error) {
				this.submitFailed = true;
			} finally {
				this.isSubmitting = false;
			}
		},
	},
};

document.addEventListener("DOMContentLoaded", () => {
	const mountPoint = document.querySelector("#app-tarot-recruitment-form");
	if (!mountPoint || !window.Vue) return;

	Vue.createApp({
		components: {
			"tarot-recruitment-form": tarotRecruitmentFormComponent,
		},
	}).mount(mountPoint);
});
