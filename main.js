
// let menu = document.querySelector('.navbar');
//
// document.querySelector("#menu-icon").onclick = () => {
//     menu.classList.toggle('active');
// }


//Header
let header = document.querySelector('header');

window.addEventListener('scroll' , () =>{
    header.classList.toggle('shadow', window.scrollY > 0);
});

//navigation bar
let menu = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => {
    menu.classList.toggle('active');
}
//hide menu and search box when scrolling
window.onscroll = () =>{
    menu.classList.remove('active');
}
//new code for fade
AOS.init({
    duration: 3000,
    once: true,
});