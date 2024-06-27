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
//getUserBoards
//router.get('/')
router.get('/:name',        getBoardsbyName )
//crear un tablero deberia estar asociado a un id de usuario
router.post('/',       createBoard) 
router.post('/:name/add/:hbl_id', addHBL2Board)
//add user to board
router.put('/:uid',    updateBoard) 
router.delete('/:uid', deleteBoard)


module.exports = router
