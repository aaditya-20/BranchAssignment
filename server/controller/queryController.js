const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const queriesModel = require("../model/queriesModel");

module.exports.addQuery = async (req, res, next) => {
	try {
		const { message, userId } = req.body;
		const data = await queriesModel.create({
			message,
			userId,
		});
		if (data)
			return res.json({ msg: "Query Added Successfully", status: true });
		return res.json({ msg: "Failed to add query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.getQueries = async (req, res, next) => {
	try {
		const {userId} = req.body;
		var data;
		if(userId===""){
			data = await queriesModel.find({requested: "" }).sort({ time: 1 });
		}
		else{
			data = await queriesModel.find({userId:userId,resolved: "" }).sort({ time: 1 });
		}
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.searchQuery = async (req, res, next) => {
	try {
		const { searchKeyword } = req.body;
		var regex = new RegExp(searchKeyword, "i");
		const data = await queriesModel.find({ requested: "" ,message: regex }).sort({ time: 1 });
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.getCurrentAdminQueries = async (req, res, next) => {
	try {
		const { userId } = req.body;
        const data = await queriesModel
			.find({ requested: userId,resolved:"" })
			.sort({ time: 1 });
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.getCurrentCustomerQueries = async (req, res, next) => {
	try {
		const { userId } = req.body;
        const data = await queriesModel
			.find({ userId: userId,resolved : { $ne: ""}})
			.sort({ time: 1 });
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.getSlots = async (req, res, next) => {
	try {
		const { userId,ids } = req.body;
        const data =await queriesModel.updateMany({_id: {$in: ids}}, { requested: userId })
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
module.exports.resolveQuery = async (req, res, next) => {
	try {
		const { queryId, solution } = req.body;
        const data =await queriesModel.findOneAndUpdate({_id:queryId},{resolved:solution})
		if (data) return res.json({ data, status: true });
		return res.json({ msg: "Failed to get query", status: false });
	} catch (error) {
		next(error);
	}
};
