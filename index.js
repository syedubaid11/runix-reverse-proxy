const express=require('express')
const httpProxy=require('http-proxy')

const app=express();
const PORT=8000;

const BASE_PATH="https://runix-v2.s3.ap-south-1.amazonaws.com/__outputs"

const proxy=httpProxy.createProxy()

let projectId=null;

app.listen(PORT || process.env.reversePorxyPORT ,()=>{
    console.log('Reverse Proxy listening on PORT:',PORT)
})

//middleware to catch the project id
app.use('/p/:projectId',(req,res,next)=>{
    req.projectId=req.params.projectId;
    next();
})

// proxy for the intial index.html request
app.use('/p/:projectId',(req,res)=>{
    const resolvesTo=`${BASE_PATH}/${req.projectId}`
    proxy.web(req,res,{target:resolvesTo, changeOrigin:true})
})

// proxy for assets folder
app.use('/assets/',(req,res)=>{
    const resolvesTo=`${BASE_PATH}/${req.projectId}/assets`
    proxy.web(req,res,{target:resolvesTo, changeOrigin:true})
})


proxy.on('proxyReq',(proxyReq,req,res)=>{
    const url=req.url
    if(url=="/"){
        proxyReq.path+='index.html'
        return proxyReq;
    }
})