import PouchDB from 'pouchdb-react-native' ; 'pouchdb-core';
export const dbMeme  = new PouchDB(process.env.MEMEDB);
export const dbMemevote = new PouchDB(process.env.MEMEUPVOTE);
export const dbMemeaccount = new PouchDB(process.env.MEMEACCOUNT)