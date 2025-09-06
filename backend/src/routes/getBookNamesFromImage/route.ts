import express from "express";

const router: express.Router = express.Router();




router.post('/getBookNamesFromImage', (req: express.Request, res: express.Response) => {

  console.log(req)

  res.send({
    "message": "done"
  });

});

export default router;

