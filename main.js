'use strict';

const primeWorker = new Worker("worker.js")

function spin()
{
    const spinner = document.getElementById("spinner")
    let angle = 0;
    setInterval(()=>{
        angle++;
        spinner.style.transform = `rotate(${angle}deg)`;

    },20);
}
spin();


const fileinput = document.getElementById('fileinput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const srcImage = new Image();


let imgData = null;
//Pixels of the original image
let OriginalPixels = null;
//Pixels modified
//let currentPixels = null;

//Listen for the fileinput when we select
fileinput.onchange = function(e){
    //check if we get a file and if at least we have a one document
    if(e.target.files && e.target.files.item(0)){
        srcImage.src  = URL.createObjectURL(e.target.files[0]);

    }
}

srcImage.onload = function(){

    srcImageHeight = srcImage.height;
    srcImageWidth = srcImage.width;
    //here we modify the sizes of the original image
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
    ctx.drawImage(srcImage,0,0, srcImage.width, srcImage.height)
    imgData = ctx.getImageData(0,0, srcImage.width, srcImage.height)
    OriginalPixels = imgData.data.slice();
}




///read the information
primeWorker.onmessage = function (event) {
    console.log(srcImage.width, srcImage.height);
    const newImgData = event.data;
    ctx.putImageData(newImgData, 0, 0, 0, 0, srcImage.width, srcImage.height);
}


////send message
let srcImageHeight = null;
let srcImageWidth = null;

function startprocessing() {
    primeWorker.postMessage({
        OriginalPixels:OriginalPixels,
        imgData:imgData,
        srcImageWidth:srcImageWidth,
        srcImageHeight:srcImageHeight,
    })
}