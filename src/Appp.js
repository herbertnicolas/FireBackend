import firebase from "./firebaseConnection";
import './style.css'; 
import {useState , useEffect} from 'react';

function App(){
  const [ idUser , setIdUser ] = useState('')
  const [ nome, setNome ] = useState('')
  const [ idade, setIdade ] = useState('')
  const [ users, setLista ] = useState([])

  const [ email, setEmail ] = useState('')
  const [ senha, setSenha ] = useState('')
  const [ userLogged, setUserLogged ] = useState({})
  const [ userLoginState, setUserLoginState ] = useState(false)


  useEffect(()=>{
    async function loadLista(){
      
      await firebase.firestore().collection('users')
      .onSnapshot((doc)=>{
        let lista = [];
        doc.forEach((item) => {
          lista.push({
            id: item.id,
            nome: item.data().nome,
            idade: item.data().idade
          })
        })
        setLista(lista);
      })
    }
    loadLista();
  },[])

  useEffect(()=>{
    async function persistLogin(){
      await firebase.auth().onAuthStateChanged((user) => {
        if(user){
          setUserLoginState(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        }
        else{
          setUserLoginState(false);
          setUserLogged({})
        }
      })
    }
    persistLogin();
  }, [])

  async function cadastrarUser(){
    await firebase.auth().createUserWithEmailAndPassword( email , senha )
    .then((value) => {
      console.log("USUARIO CADASTRADO COM SUCESSO!")
    })
    .catch((error) => {
      if(error.code === 'auth/week-password') {
        alert("A senha escolhida é muito fraca")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Este email já está em uso")
      }
      console.log("Erro no cadastro: " + error)
    })
  }

  async function logout(){
    await firebase.auth().signOut();
  } 

  async function listarUsers(){
    let lista = [];

    await firebase.firestore().collection('users')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          nome: doc.data().nome,
          idade: doc.data().idade
        })
      })
      setLista(lista);
    })
    .catch((error) => {
      console.log("Gerou um erro no listarUsers()! " + error)
    })
  }

  async function atualizarUser(){
    await firebase.firestore().collection('users')
    .doc(idUser)
    .update({
      nome: nome,
      idade: idade
    })
    .then(() => {
      console.log("Usuário atualizado com sucesso!")
    })
    .catch((error) => {
      console.log("Gerou erro no atualizarUser()! " + error)
    })
  }

  async function removerUser(id){
    await firebase.firestore().collection('users')
    .doc(id)
    .delete()
    .then(() => alert('Item removido com sucesso!'))
    .catch((error) => console.log("Gerou erro na remoção! " + error))
  }
  return(
    <div>
      <div>
        {userLoginState && (
          <div>
            <strong>Você está logado como {userLogged.email}. Seja bem vindo!</strong>
            <span>ID: {userLogged.uid}</span>
          </div>
        )}
      </div>
      
      <div className="container">
        <h1>ReactJS + Firebase</h1>
        <label>Email: </label>
        <input type="text" value={ email } onChange={(e) => {setEmail(e.target.value)}}/>
        <label>Senha: </label>
        <input type="password" value={ senha } onChange={(e) => setSenha(e.target.value)}/>
        <button onClick={cadastrarUser}>Cadastrar</button>
        <button onClick={logout}>Logout</button>
        <hr/>
        
        <label>ID: </label>
        <input type="text" value={idUser} onChange={(e) => setIdUser(e.target.value)}/> <br/>
        
        <label>Nome: </label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/> <br/>
        
        <label>Idade: </label>
        <input type="text" value={idade} onChange={(e) => setIdade(e.target.value)}/> <br/>

        <button onClick={listarUsers}>Listar</button>
        <button onClick={atualizarUser}>Atualizar</button>
        <button onClick={removerUser}>Remover</button>
      </div>

      <ul>
        {users.map((item) => {
          return(
            <li key={item.id}>
              <span>Nome: {item.nome}</span>
              <span>Idade: {item.idade}</span>
              <button onClick={() => removerUser(item.id)}>Excluir usuário</button>
            </li>  
          )
        })}
      </ul>
    </div>
  )
  
}
export default App;