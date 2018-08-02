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

if( process.env.NODE_ENV === 'dev' ){
	urlDB = 'mongodb://localhost:27017/coffee';
}else{
	urlDB = 'mongodb://coffee-user:coffee123456@ds151153.mlab.com:51153/coffee';
}

process.env.URL_DB = urlDB;
