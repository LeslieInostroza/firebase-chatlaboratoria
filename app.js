window.onload = () =>{
  firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      //siestamos logueados
      loggedOut.style.display = 'none';
      loggedIn.style.display = 'block';
      console.log('User >'+JSON.stringify(user));
    }else{
      //no estamos logeados
      loggedOut.style.display = 'block';
      loggedIn.style.display = 'none';
    }
  });

  firebase.database().ref('messages')
  .limitToLast(2) // filtro
  .once('value')
  .then((messages)=> {
    console.log('mensajes > '+JSON.stringify(messages));
  })
  .catch(()=>{

  })

  //aca comenzamos a escuchar por nuevos mensajes usando el evento on child_added
  firebase.database().ref('messages')
  .limitToLast(1)
  .on('child_added', (newMessage)=> {
    messageContainer.innerHTML += `
    <p>Nombre: ${newMessage.val().creatorName}</p>
    <p>${newMessage.val().text}</p>`;
  });
};

function register(){
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
  .then(()=> {
    console.log('Usuario registrado');
  })
  .catch((error)=> {
    console.log('Erro Firebase >' +error.code);
    console.log('Error Firebase, mensaje >' +error.message);
  });
}

function login(){
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
  .then(()=>{
    console.log('Usuario con login exitoso');
  })
  .catch(()=>{
    console.log('Error de firebase >'+error.code);
    console.log('error de firebase, mensaje >'+error.mensaje);
  });
}

function logout(){
  firebase.auth().signOut()
  .then(()=>{
    console.log('chao');
    
  })
  .catch();
}
function loginFacebook(){
  const provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('user_birthday'); // tienen que pedir permiso a facebook
  provider.setCustomParameters({
    'display':'popup'

  });
  firebase.auth().signInWithPopup(provider)
  .then(()=> {
    console.log('login con Face');
    
  })
  .catch((error)=> {
    console.log('Error de firebase >'+error.code);
    console.log('error de firebase, mensaje >'+error.mensaje);
    
  });
}

// Firebase Database
// usaremos una coleccion para guardar los mensjaes, llamada message
function sendMessage(){
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;

  // para obtener una nueva llave en la coleccion message
  const newMessageKey = firebase.database().ref().child(`messages`).push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator : currentUser.uid,
    creatorName : currentUser.displayName,
    text : messageAreaText
  });
}
