const Get = require("../get");
const { get } = new Get();
/**
 * @typedef {Object} Obj
 * @property {object} options
 * @property {boolean} options.error
 * @property {boolean} options.success
 * @property {String | Number} options.id
 * @property {String} options.file
 * @property {String} options.text
 * @property {string} options.url
 * @property {String} options.title
 */
const BaseObj = require("../BaseObj");

class Animals {
	constructor() {
		this.Alpaca = this.Alpaca.bind(this);
		this.Bear = this.Bear.bind(this);
		this.Bird = this.Bird.bind(this);
		this.Camel = this.Camel.bind(this);
		this.Cat = this.Cat.bind(this);
		this.Dog = this.Dog.bind(this);
		this.Duck = this.Duck.bind(this);
		this.Fox = this.Fox.bind(this);
		this.Goose = this.Goose.bind(this);
		this.Kangaroo = this.Kangaroo.bind(this);
		this.Koala = this.Koala.bind(this);
		this.Lizard = this.Lizard.bind(this);
		this.Llama = this.Llama.bind(this);
		this.Meow = this.Meow.bind(this);
		this.Monster = this.Monster.bind(this);
		this.Panda = this.Panda.bind(this);
		this.Racoon = this.Racoon.bind(this);
		this.Redpanda = this.Redpanda.bind(this);
		this.Seal = this.Seal.bind(this);
		this.Shibe = this.Shibe.bind(this);
		this.Wolf = this.Wolf.bind(this);
		this.Woof = this.Woof.bind(this);
	}
	/**
	 * Gets a random alpaca picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Returns the body
	 * @example
	 * const response = await this.Api.Alpaca()
	 */
	async Alpaca() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://apis.duncte123.me/animal/alpaca`
				);
				const obj = new BaseObj({
					error: false,
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random bear picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} The base API object
	 * @example
	 * const response = await this.Api.Bear();
	 */
	async Bear() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://no-api-key.com/api/v1/animals/bear`
				);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random bird picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Sends a bird picture
	 * @example
	 * const response = await this.Api.Bird();
	 */
	async Bird() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/bird`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a picture of a camel
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random camel picture
	 * @example
	 * const res = await Camel();
	 */
	async Camel() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/camel`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Get a picture of a cat
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random cat picture
	 * @example
	 * const res = await this.Api.Cat();
	 */
	async Cat() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://aws.random.cat/meow`);
				const obj = new BaseObj({ file: res.file });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Random dog picture
	 * @returns {Promise<Obj>} Random dog picture
	 * @example
	 * const Api = require("./functions")
	 * const api = new Api();
	 *
	 * const dog = await api.dog();
	 * return message.channel.send(dog.file)
	 */
	async Dog() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://dog.ceo/api/breeds/image/random`);
				const obj = new BaseObj({ file: res.message, success: res.status });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random duck picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random duck picture
	 * @example
	 * const res = await this.Api.Duck();
	 */
	async Duck() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/duck`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random fox picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random fox picture
	 * @example
	 * const res = await this.Api.Fox();
	 */
	async Fox() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/fox`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random goose picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random goose picture
	 * @example
	 * const goose = await this.Api.Goose();
	 */
	async Goose() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://nekos.life/api/v2/img/goose`);
				const obj = new BaseObj({ file: res.url });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random kangaroo picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random kangaroo picture
	 * @example
	 * const res = await this.Api.Kangaroo();
	 */
	async Kangaroo() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/animal/kangaroo`
				);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random koala picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random Koala picture
	 * @example
	 * const res = await this.Api.Koala();
	 */
	async Koala() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/animal/koala`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random lizard picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random lizard picture
	 * @example
	 * const res = await this.Api.Lizard();
	 */
	async Lizard() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/lizard`);

				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random llama picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random llama picture
	 * @example
	 * const res = await this.Api.Llama();
	 */
	async Llama() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/llama`);

				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random cat picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random cat picture
	 * @example
	 * const res = await this.Api.Meow();
	 */
	async Meow() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://nekos.life/api/v2/img/meow`);
				const obj = new BaseObj({ file: res.url });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random monster picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random monster picture
	 * @example
	 * const res = await this.Api.Monster();
	 */
	async Monster() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://apis.duncte123.me/animal/discord-monster`
				);

				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random panda picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random panda picture
	 * @example
	 * const res = await this.Api.Panda();
	 */
	async Panda() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/panda`);

				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random racoon picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random racoon picture
	 * @example
	 * const res = await this.Api.Racoon();
	 */
	async Racoon() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/animal/racoon`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random redpanda picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random redpanda picture
	 * @example
	 * const res = await this.Api.Redpanada
	 */
	async Redpanda() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/animal/red_panda`
				);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random seal picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random seal picture
	 * @example
	 * const response = await this.Api.Seal();
	 */
	async Seal() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/seal`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random shibe picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random shibe picture
	 * @example
	 * const response = await this.Api.Shibe();
	 */
	async Shibe() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`
				);
				console.log(res);
				const obj = new BaseObj({ file: res[0] });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random wolf picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random wolf picture
	 * @example
	 * const response = await this.Api.Wolf();
	 */
	async Wolf() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://apis.duncte123.me/animal/wolf`);
				const obj = new BaseObj({
					success: res.success,
					id: res.data.id,
					file: res.data.file,
				});
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Gets a random dog  picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>} Random dog picture
	 * @example
	 * const res = await this.Api.Woof();
	 */
	async Woof() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://nekos.life/api/v2/img/woof`);
				const obj = new BaseObj({ file: res.url });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
}

class Canvas {
	constructor() {
		this.Baguette = this.Baguette.bind(this);
		this.Blurpify = this.Blurpify.bind(this);
		this.Captcha = this.Captcha.bind(this);
		this.Cheat = this.Cheat.bind(this);
		this.Clyde = this.Clyde.bind(this);
		this.Comment = this.Comment.bind(this);
		this.Crap = this.Crap.bind(this);
		this.Gay = this.Gay.bind(this);
		this.iPhoneX = this.iPhoneX.bind(this);
		this.Phcomment = this.Phcomment.bind(this);
		this.Shoot = this.Shoot.bind(this);
		this.Simp = this.Simp.bind(this);
		this.Smart = this.Smart.bind(this);
		this.Snow = this.Snow.bind(this);
		this.Timeout = this.Timeout.bind(this);
		this.Triggered = this.Triggered.bind(this);
		this.Tweet = this.Tweet.bind(this);
		this.Wasted = this.Wasted.bind(this);
		this.Whowouldwin = this.Whowouldwin.bind(this);
	}
	/**
	 * Canvas (picture eating a baguette)
	 * @author ProcessVersion <ProcessVersion@gmail.co>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Baguette(image)
	 */
	async Baguette(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=baguette&url=${image}`
				);
				const obj = new BaseObj({ file: res.message });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Applies the "blurple" colour to a profile picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {string} image Required image
	 * @returns {Promise<Obj>} Data object
	 * @example
	 * const res = await this.Api.Blurpify(image)
	 */
	async Blurpify(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=blurpify&image=${image}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Captcha picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {string} image picture or avatar
	 * @param {string} text text to display
	 * @returns {Promise<Obj>} captcha data
	 * @example
	 */
	async Captcha(image, text) {
		if (!image) throw new ReferenceError("Missing a required image");
		if (!text) throw new ReferenceError("Missing required text");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=captcha&url=${image}&username=${text}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Cheating canvas
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @param {String} image2
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Cheat(avatar1, avatar2);
	 */
	async Cheat(image, image2) {
		if (!image) throw new ReferenceError("Missing the first image");
		if (!image2) throw new ReferenceError("Missing 2nd image");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=ship&user1=${image}&user2=${image2}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Clyde picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} text
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await this.Api.Clyde("Some text here");
	 */
	async Clyde(text) {
		if (!text) throw new ReferenceError("Missing required text");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Canvas YouTube comment
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @param {String} username
	 * @param {String} comment
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await this.Api.Comment(image, username, comment)
	 */
	async Comment(image, username, comment) {
		if (!image) throw new ReferenceError("Missing required image");
		if (!username) throw new ReferenceError("Missing required username");
		if (!comment) throw new ReferenceError("Missing required comment");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/canvas/youtube-comment/?avatar=${image}&username=${username}&comment=${comment}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Crap :poop:
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @param {String} image2
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await this.Api.Crap(image, image2)
	 */
	async Crap(image, image2) {
		if (!image) throw new ReferenceError("Missing required image");
		if (!image2) throw new ReferenceError("Missing second required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/crap?stepped=${image}&stepper=${image2}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Applies a rainbow over the given picture
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await this.Api.Gay(image);
	 */
	async Gay(image) {
		if (!image) throw new ReferenceError("Missing required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://some-random-api.ml/canvas/gay/?avatar=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * iPhoneX background canvas
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await iPhoneX(image);
	 */
	async iPhoneX(image) {
		if (!image) throw new ReferenceError("Missing required image");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=iphonex&url=${image}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Makes a PH comment :eyesshaking:
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @param {String} username
	 * @param {String} comment
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Phcomment(image, username, comment)
	 */
	async Phcomment(image, username, comment) {
		if (!image) throw new ReferenceError("Missing a required image");
		if (!username) throw new ReferenceError("Missing required username");
		if (!comment) throw new ReferenceError("Missing required comment");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=phcomment&image=${image}&text=${comment}&username=${username}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Shoot the image
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = this.Api.Shoot(image);
	 */
	async Shoot(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/shoot?image=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * SIMPPPPP
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = this.Api.Simp(image);
	 */
	async Simp(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/simpcard?image=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Smort :brain:
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = this.Api.Smart(image);
	 */
	async Smart(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/smrt?image=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Snowflake
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Snow(image)
	 */
	async Snow(image) {
		if (!image) throw new ReferenceError("Missing a required image");
		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/snow?image=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Back to timeout
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Timeout(image)
	 */
	async Timeout(image) {
		if (!image) throw new ReferenceError("Missing a required image");
		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://api.no-api-key.com/api/v2/timeout?image=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Triggered
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Triggered(image)
	 */
	async Triggered(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://some-random-api.ml/canvas/triggered/?avatar=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Tweet
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} username
	 * @param {String} comment
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Tweet(username, comment)
	 */
	async Tweet(username, comment) {
		if (!username) throw new ReferenceError("Missing a required username");
		if (!comment) throw new ReferenceError("Missing a required comment");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=tweet&username=${username}&text=${comment}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Wasted
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @returns {Promise<Obj>}
	 * @example
	 * const response = await this.Api.Wasted(image);
	 */
	async Wasted(image) {
		if (!image) throw new ReferenceError("Missing a required image");

		return new Promise(async function (resolve, reject) {
			try {
				const link = `https://some-random-api.ml/canvas/wasted/?avatar=${image}`;
				const obj = new BaseObj({ file: link, success: true });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Who would win
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} image
	 * @param {String} image2
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Whowouldwin(image, image2)
	 */
	async Whowouldwin(image, image2) {
		if (!image) throw new ReferenceError("Missing a required image");
		if (!image2) throw new ReferenceError("Missing a second image");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${image}&user2=${image2}`
				);
				const obj = new BaseObj({ file: res.message, success: res.success });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
}

class Facts {
	constructor() {
		this.Bearfact = this.Bearfact.bind(this);
		this.Birdfact = this.Birdfact.bind(this);
		this.Catfact = this.Catfact.bind(this);
		this.Dogfact = this.Dogfact.bind(this);
		this.Elephantfact = this.Elephantfact.bind(this);
		this.Foxfact = this.Foxfact.bind(this);
		this.Giraffefact = this.Giraffefact.bind(this);
		this.Kangaroofact = this.Kangaroofact.bind(this);
		this.Koalafact = this.Koalafact.bind(this);
		this.Pandafact = this.Pandafact.bind(this);
		this.Racoonfact = this.Racoonfact.bind(this);
		this.Whalefact = this.Whalefact.bind(this);
	}
	/**
	 * Bear fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Bearfact();
	 */
	async Bearfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://no-api-key.com/api/v1/animals/bear`
				);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Bird fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Birdfact();
	 */
	async Birdfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/bird`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Cat fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Catfact();
	 */
	async Catfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/cat`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Dog fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Dogfact();
	 */
	async Dogfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/dog`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Elephant fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Elephantfact();
	 */
	async Elephantfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/facts/elephant`
				);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Returns a fox fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Foxfact();
	 */
	async Foxfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/fox`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a giraffe fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Giraffefact();
	 */
	async Giraffefact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/giraffe`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Kangaroo fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Kangaroofact();
	 */
	async Kangaroofact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/facts/kangaroo`
				);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Koala fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Koalafact();
	 */
	async Koalafact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/koala`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Panda fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Pandafact();
	 */
	async Pandafact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/panda`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a racoon fact
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Racoonfact();
	 */
	async Racoonfact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/racoon`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a whale fact to the chat
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Whalefact();
	 */
	async Whalefact() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/facts/whale`);
				const obj = new BaseObj({ text: res.fact });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
}

class Fun {
	constructor() {
		this.Advice = this.Advice.bind(this);
		this.Baka = this.Baka.bind(this);
		this.Changemymind = this.Changemymind.bind(this);
		this.Foxgirl = this.Foxgirl.bind(this);
		this.Joke = this.Joke.bind(this);
		this.Name = this.Name.bind(this);
		this.Neko = this.Neko.bind(this);
		this.Riddle = this.Riddle.bind(this);
		this.Truth = this.Truth.bind(this);
		this.Waifu = this.Waifu.bind(this);
		this.Wallpaper = this.Wallpaper.bind(this);
	}
	/**
	 * Sends some advice to the chat
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Advice();
	 */
	async Advice() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.adviceslip.com/advice`);
				const obj = new BaseObj({ id: res.slip.id, text: res.slip.advice });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * BAKA!
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Baka();
	 */
	async Baka() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/baka`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Change my mind
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} text
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Changemymind("Hello there is the best thing ever")
	 */
	async Changemymind(text) {
		if (!text) throw new ReferenceError("Missing text");

		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
				);
				const obj = new BaseObj({ file: res.message });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a picture of a foxgirl
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Foxgirl();
	 */
	async Foxgirl() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/foxgirl`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a joke
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Joke();
	 */
	async Joke() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/joke`);
				const obj = new BaseObj({ text: res.joke });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a name for you
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Name();
	 */
	async Name() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://nekos.life/api/v2/name`);
				const obj = new BaseObj({ text: res.name });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a neko for you!
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Neko();
	 */
	async Neko() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/neko`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a nice riddle for you
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Riddle();
	 */
	async Riddle() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/neko`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * The Scroll of truth
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {String} text
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Truth("hello there");
	 */
	async Truth(text) {
		return new Promise(async function (resolve, reject) {
			try {
				if (!text) throw new ReferenceError("Missing a required text query");
				const link = `https://api.alexflipnote.dev/scroll?text=${text.join(
					" "
				)}`;
				const obj = new BaseObj({ file: link });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Waifu just for you!
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Waifu();
	 */
	async Waifu() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/waifu`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Sends a wallpaper for you to use
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Wallpaper();
	 */
	async Wallpaper() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/wallpaper`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
}

class Reactions {
	constructor() {
		this.Cry = this.Cry.bind(this);
		this.Cuddle = this.Cuddle.bind(this);
		this.Facepalm = this.Facepalm.bind(this);
		this.Feed = this.Feed.bind(this);
		this.Hug = this.Hug.bind(this);
		this.Laugh = this.Laugh.bind(this);
		this.Lick = this.Lick.bind(this);
		this.Kiss = this.Kiss.bind(this);
		this.Pat = this.Pat.bind(this);
		this.Poke = this.Poke.bind(this);
		this.Slap = this.Slap.bind(this);
		this.Smack = this.Smack.bind(this);
		this.Smug = this.Smug.bind(this);
		this.Tickle = this.Tickle.bind(this);
		this.Wink = this.Wink.bind(this);
	}
	/**
	 * Cries
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Cry();
	 */
	async Cry() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/cry`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Cuddle
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Cuddle();
	 */
	async Cuddle() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/cuddle`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * *facepalm*
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Facepalm();
	 */
	async Facepalm() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(
					`https://some-random-api.ml/animu/face-palm`
				);
				const obj = new BaseObj({ file: res.link });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Feed *eat*
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Feed();
	 */
	async Feed() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/feed`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Hug
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Hug();
	 */
	async Hug() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/hug`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Haha
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Laugh();
	 */
	async Laugh() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/laugh`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Lick
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Lick();
	 */
	async Lick() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/lick`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * *Mwah*
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Kiss()
	 */
	async Kiss() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/kiss`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * *Pat*
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Pat();
	 */
	async Pat() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/pat`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * ***Poke***
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Poke();
	 */
	async Poke() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/poke`);
				const obj = new BaseObj({ file: res.iamge });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Slap
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Slap();
	 */
	async Slap() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/slap`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Smack smack
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Smack();
	 */
	async Smack() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/spank`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Smug();
	 */
	async Smug() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/smug`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Tickle tickle
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Tickle();
	 */
	async Tickle() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`http://api.nekos.fun:8080/api/tickle`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
	/**
	 * Returns a winking picture ;)
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @returns {Promise<Obj>}
	 * @example
	 * const res = await this.Api.Wink();
	 */
	// different api
	async Wink() {
		return new Promise(async function (resolve, reject) {
			try {
				const res = await get.https(`https://some-random-api.ml/animu/wink`);
				const obj = new BaseObj({ file: res.image });
				resolve(obj);
			} catch (e) {
				console.log(e);
				reject("An unexpected error has occurred");
			}
		});
	}
}

module.exports = {
	Animals,
	Canvas,
	Facts,
	Fun,
	Reactions,
};
