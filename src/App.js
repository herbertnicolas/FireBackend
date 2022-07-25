import firebase from "./firebaseConnection";
import './style.css'; 
import {useState , useEffect} from 'react';

function App() {
  const [ titulo, setTitulo ] = useState('');
  const [ autor, setAutor ] = useState('');
  const [ posts, setPosts] = useState([]);
  const [ idPost, setIdPost ] = useState('')
  //useEffect para caso quiser atualizar em tempo real
  useEffect(() => {
    async function loadPosts(){
      
      await firebase.firestore().collection('posts')
      .onSnapshot((doc) =>{
        let listaPosts = [];
     
        doc.forEach((item) => {
          listaPosts.push({
            id: item.id,
            autor: item.data().autor,
            titulo: item.data().titulo
          })
        })
        setPosts(listaPosts)
      })
    }
    loadPosts();
  }, []);

  async function handleAdd(){
    await firebase.firestore().collection('posts')
    // caso for pra inserir nova key gerada automaticamente:
    // .add({
    //   titulo: titulo,
    //   autor: autor,
    // })
    .add({
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("DADOS CADASTRADOS COM SUCESSO!");
      setTitulo('');
      setAutor('');
    })
    .catch((error) => {
      console.log("Gerou erro:" + error)
    })
  }


  async function buscarPost(){
    await firebase.firestore().collection('posts')
    .get()
    .then((snapshot) => {
      let lista = []

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          autor: doc.data().autor,
          titulo: doc.data().titulo
        })
      })
      setPosts(lista)
    })
    .catch((error) => {
      console.log("Gerou erro no busca:" + error)
    })
  }

  async function atualizaPost(){
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      autor: autor,
      titulo: titulo
    })
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>
      
      <div className="container">
        <label>ID: </label>
        <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)}/>
        
        <label>Título: </label>
        <textarea className="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
        
        <label>Autor: </label>
        <input className="autor" value={autor} onChange={(e) => setAutor(e.target.value)}/>
        
        <button onClick={ handleAdd }>Cadastrar</button>
        <button onClick={ buscarPost }>Buscar</button>
        <button onClick={ atualizaPost }>Atualizar</button>
      </div>

      <ul>
        {posts.map((item)=>{
          return(
            <li key={item.id}>
              <span>ID: {item.id}</span> <br/>
              <span>Autor: {item.autor}</span> <br/>
              <span>Titulo: {item.titulo}</span> <br/>
              <br/>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App;


