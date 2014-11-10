var CL = {};
CL.SFBAY = 'sfo';


var config = {};

/**
 * CONFIG USED BY SLAVES
 */
config.worker_id = 1;

//where to locally store temp photos
config.photos = {};
config.photos.local = '/Users/comart/Desktop';

config.app = 'http://admin.carlypso.com:8000';
//config.app = 'http://localhost:8000';

config.account = {};
config.account.name = 'Christopher';
config.account.email = 'carlypsodealer@gmail.com';
config.account.pass = 'sellcars';
config.account.phone='650-826-3842';
config.account.ordernumber = '34849933';



config.MINIMUM_PHOTOS = 0;
module.exports = config;




