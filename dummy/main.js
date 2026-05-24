

function serve(req,res){
       
    if(req === "pizza"){
         console.log("here is your pizza");
    }

     if(req === "water"){
         console.log("here is your water");
    }
};


serve("water",function(answer){
     console.log(answer);
});