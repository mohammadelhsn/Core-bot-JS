const http = require("http");
const https = require("https");
const BaseObj = require("./BaseObj");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = class fetch {
	get = {
		/**
		 * Makes an XMLHttpRequest and returns the data.
		 * @author ProcessVersion <ProcessVersion@gmail.com>
		 * @param {String} link The link to get
		 * @returns {Promise<Object>} Object
		 * @example
		 * const res = await api.get.https("https://google.com")
		 */
		async https(link) {
			if (!link) throw new ReferenceError("Missing a required param");
			let data = "";
			let url;
			const xhr = new XMLHttpRequest();

			return new Promise(function (resolve, reject) {
				xhr.onreadystatechange = function () {
					if (this.readyState == 4 && this.status == 200) {
						data += xhr.responseText;
						url = JSON.parse(data);
						resolve(url);
					}
				};

				xhr.open("GET", link, true);

				xhr.send();

				xhr.onload = function () {
					if (xhr.status !== 200) {
						reject(`Error ${xhr.status}: ${xhr.statusText}`);
					}
				};
				xhr.onprogress = function (event) {
					if (event.lengthComputable) {
						console.log(`Received ${event.loaded} of ${event.total} bytes`);
					} else {
						console.log(`Received ${event.loaded} bytes`); // no Content-Length
					}
				};
				xhr.onerror = function () {
					reject("Request failed");
				};
			});
		},
	};
};
