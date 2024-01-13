const factory = require('../controllers/handlerFactory')
const IssueBook = require('../models/issueModel')


exports.getIssueBook = factory.getOne(IssueBook)
exports.getAllIssueBook = factory.getAll(IssueBook)
exports.createIssueBook = factory.createOne(IssueBook)
exports.deleteIssueBook = factory.deleteOne(IssueBook)
exports.updateIssueBook = factory.updateOne(IssueBook)