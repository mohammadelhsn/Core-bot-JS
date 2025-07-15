/**
 * @author ProcessVersion <ProcessVersion@gmail.com>
 * @class
 * @example
 * const BaseObj = require("./BaseObj.js")
 */
module.exports = class BaseObj {
	/**
	 * The base for the API section of the bot
	 * @author ProcessVersion <ProcessVersion@gmail.com>
	 * @param {object} options
	 * @param {boolean} options.error
	 * @param {boolean} options.file
	 * @param {String} options.file
	 * @param {String} options.text
	 * @param {String|Number} options.id
	 * @param {String} options.author
	 * @param {String} options.url
	 * @param {String} options.title
	 * @example
	 * const obj = new BaseObj({ opts })
	 */
	constructor(options = { error, success, file, text, id, author, title }) {
		this.error = options.error ? options.error : false;
		this.success = options.success ? options.success : null;
		this.file = options.file ? options.file : null;
		this.text = options.text ? options.text : null;
		this.id = options.id ? options.id : null;
		this.author = options.author ? author : null;
		this.url = options.url ? options.url : null;
		this.title = options.title ? options.title : null;
	}
};
