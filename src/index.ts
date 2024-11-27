import server from './server'
import color from 'colors'

const port = process.env.PORT || 4200

server.listen(port, () =>{
    console.log(color.bgCyan.bold(`Rest api funcionando por el puerto ${port}`))
})