const socket=io()

//Element
const messageFormDOM=document.querySelector('#message-form')
const messageFormInputDOM=messageFormDOM.querySelector('input')
const messageFormButtonDOM=messageFormDOM.querySelector('button')
const locationDOM=document.querySelector('#sendLocation')   //location button
const messagesDOM=document.querySelector('#messages')



//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#locationMessage-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    //Get new message element
    const newMessage=messagesDOM.lastElementChild

    //Get height of new message
    const newMessageStyles=getComputedStyle(newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=newMessage.offsetHeight+newMessageMargin

    //Visible height
    const visibleHeight=messagesDOM.offsetHeight

    //Height of messages container
    const containerHeight=messagesDOM.scrollHeight

    //How far down have we scrolled

    const scrollOffset=messagesDOM.scrollTop+ visibleHeight

    if (containerHeight-newMessageHeight<=scrollOffset) {
        messagesDOM.scrollTop=messagesDOM.scrollHeight  //scroll to bottom
    }
}


socket.on('Message',(Message)=>{

    const HTML=Mustache.render(messageTemplate,{
        username:Message.username,
        message:Message.text,
        createdAt:moment(Message.createdAt).format('h:mm A')
    })
    
    messagesDOM.insertAdjacentHTML('beforeend',HTML)
    autoscroll()
    
})


socket.on('locationMessage',(url)=>{
    //console.log(url)
    const HTML=Mustache.render(locationMessageTemplate,{
        username:url.username,
        location:url.url,
        createdAt:moment(url.createdAt).format('h:mm A')
    })

    messagesDOM.insertAdjacentHTML('beforeend',HTML)
    autoscroll()
    
})

socket.on('roomData',({room, users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
    
})

messageFormDOM.addEventListener('submit',(e)=>{
    e.preventDefault()

    //Disable form until acknowledged
    
    messageFormButtonDOM.setAttribute('disabled','disabled')

    const message=e.target.elements.message.value     //e.target targets form .elements has all the names
    
    //Enable
    socket.emit('sendMessage',message,()=>{
        messageFormButtonDOM.removeAttribute('disabled')
        messageFormInputDOM.value=""
        messageFormInputDOM.focus()

        console.log('The message was delivered')
        
    })
})

locationDOM.addEventListener('click',()=>{
    //disable untill acknowledgement
    
    if(!navigator.geolocation)
    {
        return alert('Geolocation is not suported by your browser')
    }

    locationDOM.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        pos={
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        }

        socket.emit('sendLocation',pos,()=> {
            console.log('Location Shared')
            //Enable
            locationDOM.removeAttribute('disabled')

    
        })
        
    })
    
})

socket.emit('join',{username,room},(error)=>{
    if (error) {
        alert(error)
        location.href='/'
    }
})