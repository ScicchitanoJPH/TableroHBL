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
        const { name, devices, users} = req.body;
    
        const newBoard = {
          name,
          devices,
          users
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


    
      

      addDevice2Board = async (req, res) => {
        try {
            const { name, hbl_id } = req.body;
    
            if (!name || !hbl_id) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Missing required fields: name and hbl_id are both required.'
                });
            }
    
            const boardArray = await this.service.getBoard({ name });
    
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
    
            // Convertir `hbl_id` a un array si es solo un valor
            const hbl_ids = Array.isArray(hbl_id) ? hbl_id : [hbl_id];
    
            // Verificar duplicados (opcional, depende de tu lógica)
            const existingHBLs = board.devices.filter(device => hbl_ids.includes(device.hbl_id));
            if (existingHBLs.length > 0) {
                const duplicateHBLs = existingHBLs.map(device => device.hbl_id);
                return res.status(409).send({
                    status: 'error',
                    message: `hbl_id(s) "${duplicateHBLs.join(', ')}" already exist(s) in this board.`
                });
            }
    
            // Agregar los nuevos hbl_id al array de dispositivos
            hbl_ids.forEach(hbl_id => {
                board.devices.push({ hbl_id });
            });
    
            await board.save();
    
            res.status(200).send({
                status: 'success',
                message: `hbl_id(s) "${hbl_ids.join(', ')}" added to board "${name}" successfully.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                message: 'Internal server error. Please try again later.',
            });
        }
    };




    addUser2Board = async (req, res) => {
      try {
          const { name, email } = req.body;
  
          if (!name || !email) {
              return res.status(400).send({
                  status: 'error',
                  message: 'Missing required fields: name and email are both required.'
              });
          }
  
          const boardArray = await this.service.getBoard({ name });
  
          // Verifica si `getBoard` devuelve un array y accede al primer elemento
          const board = Array.isArray(boardArray) ? boardArray[0] : boardArray;
  
          if (!board) {
              return res.status(404).send({
                  status: 'error',
                  message: `Board with name "${name}" not found.`
              });
          }
  
          console.log(`board: ${JSON.stringify(board)}`);
          console.log(`board.users: ${JSON.stringify(board.users)}`);
  
          // Convertir `email` a un array si es solo un valor
          const emails = Array.isArray(email) ? email : [email];
  
          // Verificar duplicados (opcional, depende de tu lógica)
          const existingHBLs = board.users.filter(user => emails.includes(user.email));
          if (existingHBLs.length > 0) {
              const duplicateHBLs = existingHBLs.map(user => user.email);
              return res.status(409).send({
                  status: 'error',
                  message: `email(s) "${duplicateHBLs.join(', ')}" already exist(s) in this board.`
              });
          }
  
          // Agregar los nuevos email al array de dispositivos
          emails.forEach(email => {
              board.users.push({ email });
          });
  
          await board.save();
  
          res.status(200).send({
              status: 'success',
              message: `email(s) "${emails.join(', ')}" added to board "${name}" successfully.`,
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