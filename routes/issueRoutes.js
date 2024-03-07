const express = require('express')


const authController = require('../controllers/authController')
const issueController = require('../controllers/issueController')


const router = express.Router()

router.use(authController.protect)
router.use(authController.restrictTo('librarian'))

router.route('/').get(issueController.getAllIssueBook)
router.post('/issue-book',issueController.createIssueBook)
router.route('/:id').get(issueController.getIssueBook).patch(issueController.updateIssueBook).delete(issueController.deleteIssueBook)


module.exports = router