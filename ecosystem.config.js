module.exports = {
    apps : [{
        name   : "jobo-portret-hr-bot",
        script : "./dist/index.js",
        env_development: {
            PORT: "3000",
            NODE_ENV: "development",
            TOKEN: "5191071598:AAFWslOs8DiJtAWOuzYGZuKG70s_qrBZux0"
        },
        env_production: {
            PORT: "3319",
            NODE_ENV: "production",
            TOKEN: "5191071598:AAFWslOs8DiJtAWOuzYGZuKG70s_qrBZux0"
        }
    }]
}
