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


    
      

    addHBL2Board = async (req, res) => {
      try {
        const { name, hbl_id } = req.params; 
    
        if (!name || !hbl_id) {
          return res.status(400).send({
            status: 'error',
            message: 'Missing required fields: name and hbl_id are both required.'
          });
        }
    
        const boardArray  = await this.service.getBoard({ name });

        // Verifica si `getBoard` devuelve un array y accede al primer elemento
        const board = Array.isArray(boardArray) ? boardArray[0] : boardArray;
    
        if (!board) {
          return res.status(404).send({
            status: 'error',
            message: `Board with name "${name}" not found.`
          });
        }

        console.log(`board: ${JSON.stringify(board)}`);
        console.log(`board.devices: ${JSON.stringify(board.devices)}`);
    
        // Check for duplicate hbl_id before update (optional, depends on your logic)
        const existingHBL = board.devices.find(device => device.hbl_id === hbl_id);
        if (existingHBL) {
          return res.status(409).send({
            status: 'error',
            message: `hbl_id "${hbl_id}" already exists in this board.`
          });
        }
    
        board.devices.push({ hbl_id }); // Add the new hbl_id to the devices array
        await board.save();
    
        res.status(200).send({
          status: 'success',
          message: `hbl_id "${hbl_id}" added to board "${name}" successfully.`,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          status: 'error',
          message: 'Internal server error. Please try again later.',
        });
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