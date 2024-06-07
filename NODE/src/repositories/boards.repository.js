const { BoardDto } = require("../dto/boardDto")
const { boardModel } = require("../dao/models/board.model")

// capa de servicio
class BoardRepository {
    constructor(){
        this.dao = boardModel
    }

    getBoards =   async () => await this.dao.find()
    getBoard =    async (filter) => await this.dao.find(filter)
    exists =   async (filter) => await this.dao.exists(filter)
    createBoard = async (newBoard) => {
        console.log("createBoard", newBoard)
        const newBoardDto = new BoardDto(newBoard)
        return await this.dao.create(newBoardDto)
    
    }
    updateBoard = async (uid, boardToUpdate) => {
        console.log("uid :", uid)
        console.log("boardToUpdate :", boardToUpdate)
        await this.dao.updateOne({hbl_id:uid}, boardToUpdate)
        
    }
    deleteBoard = async (uid) => await this.dao.findByIdAndDelete({_id: uid})

}


module.exports = BoardRepository