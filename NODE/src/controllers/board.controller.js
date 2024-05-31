const BoardRepository = require("../repositories/boards.repository")
const { BoardDto } = require("../dto/boardDto")

class BoardController {
    constructor(){
        this.service = new BoardRepository(new BoardDto());
    }

    getBoards = async (req, res)=>{  
        try {
            const boards = await this.service.getBoards()
            console.log(boards)
            res.send(boards)
        } catch (error) {
            res.send({status: 'error', message: error})
            
        }    
    }

    

    getBoardsbyName = async (req, res)=>{
        const { name } = req.params
        const board = await this.service.getBoard({name:name})
    
        // console.log(req.params)
    
        res.send(board)
        return board;
    }
    
    getBoard = async (req, res)=>{
        const { name } = req.params
        const board = await this.service.getBoard({name: name})
    
        // console.log(req.params)
    
        res.send(board)
    }
    
    createBoard = async (req, res) => {
        console.log(req.body);
        const { name, devices} = req.body;
    
        const newBoard = {
          name,
          devices
        };
        console.log("newBoard : " + newBoard);
        try {
          // Check if a board with the same hbl_id already exists
          let existingBoard = null;
          existingBoard = await this.service.exists({ name: newBoard.name});
          
          if (existingBoard) {

            const updatedBoard = await this.service.updateBoard(name, newBoard);
    
            res.status(200).send({
              status: "success",
              message: "Board with name already exists. Updated existing board.",
              board: updatedBoard,
            });
          } else {
            // Create new board if no existing one found
            const result = await this.service.createBoard(newBoard);
            console.log("New board created:", result);
    
            res.status(200).send({
              status: "success",
              message: "New board created.",
              board: result,
            });
          }
        } catch (error) {
          console.error("Error creating board:", error);
          res.status(500).send({ status: "error", message: error.message });
        }
      };
    
    updateBoard =  async (req, res)=>{
        const {uid} = req.params
        const boardToUpdate = req.body
    
        const result = await this.service.updateBoard(uid, boardToUpdate)
    
        res.status(200).send({
            status: 'success',
            message: result
        })
    }
    
    deleteBoard =  async (req, res)=>{
        const { uid } = req.params
        const result = await this.service.deleteBoard( uid)
        res.send(result)
    }
}

module.exports = BoardController