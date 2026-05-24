
let title = document.getElementById("main-title");
console.log(title.textContent);
let info=document.querySelectorAll(".info");


console.log(title.textContent);

console.log(info[0].textContent);
console.log(info[1].textContent);

title.style.color ="red";

title.setAttribute("id","saurav" )


let list = document.querySelectorAll(".list");
list[0].style.text="saurav";
list[1].style.color="red";
list[2].style.fontSize="500px";
list[2].style.color="white";
list[3].textContent="lorem*10";



list[0].setAttribute("style" ,"font-size:100px;");
list[1].setAttribute("style", "font-size:50px;");