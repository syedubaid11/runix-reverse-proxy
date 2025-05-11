const express=require('express')
const httpProxy=require('http-proxy')
const cookieParser=require('cookie-parser');


const app=express();
app.use(cookieParser());
const PORT=8000;

const BASE_PATH="https://runix-v2.s3.ap-south-1.amazonaws.com/__outputs"

const proxy=httpProxy.createProxy()

app.listen(PORT || process.env.reversePorxyPORT ,()=>{
    console.log('Reverse Proxy listening on PORT:',PORT)
})

// proxy for the intial index.html request
app.use('/p/:projectId',(req,res)=>{
    const { projectId }=req.params;
    res.cookie('projectId',projectId);
    const resolvesTo=`${BASE_PATH}/${projectId}`
    console.log(resolvesTo);
    proxy.web(req,res,{target:resolvesTo, changeOrigin:true})
})

// proxy for assets folder
app.use('/assets/',(req,res)=>{
    const projectId=req.cookies.projectId;
    if(!projectId){
        return res.status(400).send('Missing Project Id');
    }
    const resolvesTo=`${BASE_PATH}/${projectId}/assets`
    console.log(resolvesTo);
    proxy.web(req,res,{target:resolvesTo, changeOrigin:true})
    
})


proxy.on('proxyReq',(proxyReq,req,res)=>{
    const url=req.url
    if(url=="/"){
        proxyReq.path+='index.html'
        return proxyReq;
    }
})