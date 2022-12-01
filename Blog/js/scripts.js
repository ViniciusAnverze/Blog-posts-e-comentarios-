const url = "https://jsonplaceholder.typicode.com/posts";

const carregamento = document.getElementById('carregando');
const postsContainer = document.getElementById('posts-container');

const postPage = document.getElementById('post')
const postContainer = document.getElementById('post-container')
const commentsContainer = document.getElementById('comments-container')
const inputEmail = document.getElementById("email");
const inputComment = document.getElementById('body')
const commentForm = document.getElementById('form')


//Get id from URL

const urlSearchParams = new URLSearchParams(window.location.search)
const id = urlSearchParams.get('id');

async function getAllPosts(){
    const response = await fetch(url);

    console.log(response)

    const data = await response.json();

    console.log(data)

    carregamento.classList.add("hide")

    data.map((item) => {
        
        const div = document.createElement('div')
        const title = document.createElement('h2'); 
        const body = document.createElement('p')
        const link = document.createElement('a'); 

        title.innerText = item.title;
        body.innerText = item.body;
        link.innerText = "Ler"
        link.setAttribute('href', `post.html?id=${item.id}`)

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div)

    })
}

//Get individual post

async function getPost(id){
    const [responsePost, responseComment] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json();
    const dataComment = await responseComment.json();

    const title = document.createElement('h1'); 
    const body = document.createElement('p');

    carregamento.classList.add('hide');
    postPage.classList.remove('hide');

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    dataComment.map((item) => {
        const bodyComment = document.createElement('p');
        const emailComment = document.createElement('h3');
        const line = document.createElement('hr');

        bodyComment.innerText = item.body;
        emailComment.innerText = "Email: "+item.email;
        
        commentsContainer.appendChild(emailComment);
        commentsContainer.appendChild(bodyComment);
        commentsContainer.appendChild(line)
        console.log(item);

    })

    postContainer.appendChild(title);
    postContainer.appendChild(body);
}

function createComments(comentario){
    const bodyComment = document.createElement('p');
    const emailComment = document.createElement('h3');
    const line = document.createElement('hr');

    bodyComment.innerText = comentario.body;
    emailComment.innerText = "Email: "+comentario.email;

    commentsContainer.appendChild(emailComment);
    commentsContainer.appendChild(bodyComment);
    commentsContainer.appendChild(line);
}

async function postComment(comment){
    const response = await fetch(`${url}/${id}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            "Content-type": "application/json"
        }
    })
    const data = await response.json()
    console.log(data)
}

if(!id){
    getAllPosts();
}else{
    getPost(id);
    
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let comment = {
            email: inputEmail.value,
            body: inputComment.value
        }

        createComments(comment);

        comment = JSON.stringify(comment)

        postComment(comment)
    })
   
}

