const express = require('express')
const app = express()//aceste 2 linii de cod ne ajuta sa facem request pe api si sa initializam serverul
//import cors
const cors = require('cors')

const db = require('./models')//asa creem conexiunea dintre ORM si baza de date din mysql
app.use(express.json())
app.use(cors())
const {expressjwt: jwt} = require('express-jwt');
const bodyParser = require('body-parser');

// Definirea secretului JWT
const jwtSecret = 'your_jwt_secret'; // Același secret folosit la semnarea tokenului

// Middleware pentru parsarea JSON-urilor din requesturi
app.use(bodyParser.json());
app.use(cors());

// Middleware pentru verificarea JWT-ului, cu excepția rutelor specificate
app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }).unless({ path: ['/users/', '/users/login'] }));
//user route
const userRouter=require('./routes/UserRouter.js')
app.use("/users", userRouter)
//journal route
const journalRouter=require('./routes/journalRouter.js')
app.use("/journals",journalRouter)
//route for all targets
const allTargets=require('./routes/allTargetsRoutes.js')
app.use("/alltargets",allTargets)
//route for desserts
const desserts=require('./routes/dessertsRouter.js')
app.use("/desserts",desserts)
//route for dessertProducts
const dessertProducts=require('./routes/dessertProductsRoutes.js')
app.use("/dessertProducts",dessertProducts)
//route for Products
const productsRoutes=require('./routes/productsRoutes.js')
app.use("/products",productsRoutes)
//route for meals
const mealsRoutes=require('./routes/mealsRouter.js')
app.use("/meals",mealsRoutes)
//route for mealsProducts
const mealsProducts=require('./routes/mealsProducts.js')
app.use("/mealsProducts",mealsProducts)
//route for yourTargets
const yourTargetsRoute=require('./routes/yourTargetsRoutes.js')
app.use("/yourTargets",yourTargetsRoute)
const previousSearchesRoute=require('./routes/previousSearchesRoute.js')
app.use("/previousSearches",previousSearchesRoute)
const previousDatesRoute=require('./routes/previousDatesRoute.js')
app.use("/previousDates",previousDatesRoute)
const reviewRoute=require('./routes/reviewRouter.js')
app.use("/review",reviewRoute)
const suggestion=require('./routes/suggestionsRoutes.js')
app.use("/suggestion",suggestion)
db.sequelize.sync({ logging: console.log }).then(() => {
    //start api
    const port = process.env.PORT || 8081
    app.listen(port, () => {//atunci cand serverul porneste pe acest port
        console.log(`Server running on port ${port}`) //mesaj de testare
    })
}).catch((error) => {
    console.error("Database synchronization error:", error);
  });