//
// const moment = require ('moment')
// const {simpleExecute}  = require ('../dataBaseOracl')
//
// module.exports = async (req, res, next) => {
//
//
//     const data = moment().format('DD-MM-YYYY HH-mm')
//     await simpleExecute(
//         `UPDATE user_plane SET lastseen = :data where id='16214342988407964136001631bcc8'`,
//         [data]);
//
//     next();
// }