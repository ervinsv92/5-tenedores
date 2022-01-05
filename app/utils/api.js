import {firebaseApp} from './firebase';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const auth = getAuth(firebaseApp);

export const reauthenticate = (password)=>{
    const user = auth.currentUser;
    //console.log(auth.EmailAuthProvider)
    const credentials = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credentials);
    //return user.reauthenticateWithCredential();
}