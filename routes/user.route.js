const express = require('express');
const fs = require('fs');
const path = `${process.cwd()}/files/users.json`;
const userRoute = express.Router();
const users = JSON.parse(fs.readFileSync(path,{
    encoding:'utf-8'
}) || '[]');


userRoute.route('/random')
    .get((req,res)=> {
        const length = [...users].length;
        const random = Math.floor(Math.random() * (length))
        res.send([...users][random]);
    })


userRoute.route('/all')
    .get((req,res)=> {
        const {start,count} = req.query;
        const usersList = [...users].slice(start || 0,count?start+count:users?.length);
        res.send(usersList);
    })

userRoute.route('/save')
    .post((req,res)=> {
        const data = req.body;
        fs.writeFileSync(path,JSON.stringify([...users,{_id:Math.floor(Math.random()*(10**16))+'',...data}]));
        res.send({insert:true});
    })

userRoute.route('/update/:id')
    .patch((req,res)=> {
        const { id } = req.params;
        const data = req.body;
        const usersArray = [...users];
        const index = usersArray.findIndex(user => user._id === id);
        if (index >= 0) {
            const target = usersArray[index];
            usersArray.splice(index, 1, { ...target, ...data });
            fs.writeFileSync(path, JSON.stringify(usersArray));
            res.send({ 
                idFound: true,
                update: true });
        } else {
            res.send({ 
                idFound: false,
                update: false })
        }
    })

userRoute.route('/bulk-update')
    .patch((req,res)=> {
        const targetUsers = req.body || [];
        console.log(targetUsers);
        const success=[],failed=[];
        const usersArray = [...users];
        for (const user of targetUsers) {
            const index = usersArray.findIndex(u => u._id === user._id);
            if (index >= 0) {
                const target = usersArray[index];
                success.push(user._id);
                usersArray.splice(index, 1, { ...target, ...user });
            }
            else{
                failed.push(user._id);
            }
        }
        success.length && fs.writeFileSync(path, JSON.stringify(usersArray));
        res.send({ 
            succeeded:{
                count:success.length,
                id:success
            },
            failed:{
                count:failed.length,
                id:failed
            }
        })
    })

userRoute.route('/delete/:id')
    .delete((req,res)=> {
        const {id} = req.params;
        const usersArray = [...users];
        const target = usersArray.findIndex(u=> u._id===id);
        if (target>=0) {
            usersArray.splice(target, 1);
            fs.writeFileSync(path, JSON.stringify(usersArray));
            res.send({
                deleted:true
            })
        } else {
            res.send({
                deleted:false
            })
        }
        
    })

module.exports = userRoute;