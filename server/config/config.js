// ====================================================
// Port
// ====================================================
process.env.PORT = process.env.PORT || 3000;


// ====================================================
// Enviroment
// ====================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ====================================================
// DB
// ====================================================
let urlDB;

// ====================================================
// Token expires
// ====================================================
process.env.CAD_TOKEN = 60 * 60 * 30 * 24;

// ====================================================
// Seed
// ====================================================
process.env.SEED = process.env.SEED || 'secret';

if( process.env.NODE_ENV === 'dev' ){
	urlDB = 'mongodb://localhost:27017/coffee';
}else{
	urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

// ====================================================
// Google client ID
// ====================================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1026091179043-e0hecn0q30r7i1v4et8rft549pebvch8.apps.googleusercontent.com';