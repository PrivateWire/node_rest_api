'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sortAnswers = function(a, b) {
	//- negative a before b
	//0 no change
	//+ positive a after b
	if(a.votes === b.votes){
		return b.updatedAt - a.updatedAt;
	}
	return b.votes - a.votes;
}

var AnswerSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	votes: {type: Number, default:0}
});

AnswerSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});

AnswerSchema.method("vote", function(vote, callback) {
	if(vote === "up") {
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	this.parent().save(callback);
});

var QuestionSchema = new Schema({
	text: String,
	createdAt: {type: Date, default: Date.now},
	answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next){
	this.answers.sort(sortAnswers);
	next();
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;













