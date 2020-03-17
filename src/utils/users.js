const users=[]

const addUser=({id,username,room})=>{
    //Clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //Validate
    if (!username || !room) {
        return{
            error: 'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username
    })

    //Validate username and room
    if(existingUser)
    {
        return{
            error:'Username already exists in the room'
        }
    }

    const user={id,username,room}

    users.push(user)
    return {user}
}


const removeUser=(id)=>{
    let n=0
    let e=1
    users.forEach((user,i)=>{
        if((user.id)===id)
        {
            e=0
            n=((users.splice(i,1)[0]))
            //console.log('yes')
            
            
           
            
            
        }

    })
     if(e===1) {
        n={error: 'No such user found'}
    }
    return n

}



const getUser=(id)=>{
    let usernew
    users.forEach((user)=>{
        if (user.id===id) {
            usernew=user
            //console.log(user)
            
        }
    })
   
    return usernew
}

const getUsersInRoom=(room)=>{
    
    const usersInRoom=[]
    if (room) {
        users.forEach((user)=>{
            if (user.room===room) {
                usersInRoom.push(user)
                //console.log(usersInRoom)
                
            }
        })
    }
    return usersInRoom
}

module.exports={
    addUser,
    removeUser,getUser,
    getUsersInRoom
}


