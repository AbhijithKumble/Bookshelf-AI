import express from "express";


const router: express.Router = express.Router();


router.get('/', (req: express.Request, res: express.Response) => {
  console.log("get working")

  res.send({
    "message": "alive"
  });
});


export default router;
