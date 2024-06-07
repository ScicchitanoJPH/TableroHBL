const { Router } = require('express')
const BoardController = require('../controllers/board.controller')

const router = Router()

const {
    getBoards,
    getBoardsbyName,
    createBoard,
    addDevice2Board,
    addUser2Board,
    updateBoard,
    deleteBoard
} = new BoardController()

router.get('/',        getBoards )
router.get('/:name',        getBoardsbyName )
router.post('/',       createBoard) 
router.post('/addDevice', addDevice2Board)
router.post('/addUser', addUser2Board)
router.put('/:uid',    updateBoard) 
router.delete('/:uid', deleteBoard)


module.exports = router
