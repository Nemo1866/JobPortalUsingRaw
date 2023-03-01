function logger(n){
    return new Promise((res,rej)=>{
        setTimeout(() => {
            res(n)
        }, 1000);
    })
}
async function log(){
    console.log(1);
    let a=await logger(2)
    console.log(a);
    console.log(3);
}
log()