import { app } from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// })

//only run server in development
if (process.env.NODE_ENV !== 'production') {
    async function main() {
        try {
            //connect to database
            await prisma.$connect();
            console.log("👍 DB Connected");
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            })
        } catch (error) {
            console.log("👎 Connectin failed", error)
            //disconnect from databaase
            await prisma.$disconnect();
            process.exit(1);
        }
    }
    main();
}

export default app;
