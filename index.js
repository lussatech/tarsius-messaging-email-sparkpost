/**
 * SMTP Mail Service
 */

var Promise = require('bluebird'),
	nodemailer = require('nodemailer'),
	sparkPostTransport = require('nodemailer-sparkpost-transport');

var SparkPost = function(configs){
	this.configs = {
		options : {
			open_tracking: true,
			click_tracking: true,
			transactional: true
		},
		campaign_id : configs.campaignId,
		content : {
			template_id : configs.templateId
		},
		subtitution_data : {
			productName : configs.productName
		}
	};
};

/**
 * send function
 * @param  {Object} author   { name : {string}, email : {email}  }
 * @param  {String} receiver receiver email address
 * @param  {String} subject  email title / subjects
 * @param  {String} content  html mail content
 * @return {Promise}
 */
SparkPost.prototype.send = function(author,receiver,subject,content){
    // configure transporter
    this.transporter = Promise.promisifyAll(nodemailer.createTransport(sparkPostTransport(
		_.extend(this.configs,{
			subtitution_data : {
				sender : author.name,
				fullName : author.name
			},
			metadata : {
				subject : subject,
				content : content
			}
		})
	)));

    this.transporter.use('compile', htmlToText());
    // make request
    return this.transporter.sendMailAsync({
		recipients: [
			{
				address: {
					email: receiver,
					name: receiver
				}
			}
		]
    });
};

module.exports = function(configs) {
    return new SparkPost(configs);
};
