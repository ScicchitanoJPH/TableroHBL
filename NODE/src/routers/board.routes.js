const { Router } = require('express')
const BoardController = require('../controllers/board.controller')

const router = Router()

const {
    getBoards,
    getBoardsbyName,
    createBoard,
    addHBL2Board,
    updateBoard,
    deleteBoard
} = new BoardController()

router.get('/',        getBoards )
router.get('/:name',        getBoardsbyName )
router.post('/',       createBoard) 
router.post('/:name/add/:hbl_id', addHBL2Board)
router.put('/:uid',    updateBoard) 
router.delete('/:uid', deleteBoard)


module.exports = router
