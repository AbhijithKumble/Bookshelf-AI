import app from "./app.ts";
import dotenv from "dotenv";

dotenv.config({ debug: true })

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));

