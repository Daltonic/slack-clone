import firebase from 'firebase'
import { firebaseConfig } from '../app.config'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const provider = new firebase.auth.GithubAuthProvider()

export { auth, provider } 
export default db