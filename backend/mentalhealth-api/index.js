// temp-server.js (you can delete after test)
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});
