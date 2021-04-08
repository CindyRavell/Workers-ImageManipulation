'use strict'


let currentPixels = null;
let OriginalPixelsWorker = null;
let imgDataWorker = null;
let srcImgWidthWorker = null;
let srcImgHeightWorker = null;

function getIndex(x,y){
    return(x+y *srcImgWidthWorker)*4
}

function clamp(value){
    return Math.max(0, Math.min(Math.floor(value),255));

}

const R_OFFSET=0;
const G_OFFSET=1;
const B_OFFSET=2;


function addMaxContrast(x, y, value){
    const redIndex = getIndex(x, y) + R_OFFSET
    const greenIndex = getIndex(x, y) + G_OFFSET
    const blueIndex = getIndex(x, y) + B_OFFSET

    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]

    const alpha = (value + 255) / 255 

    const nextRed = alpha * (redValue - 128) + 128
    const nextGreen = alpha * (greenValue - 128) + 128
    const nextBlue = alpha * (blueValue - 128) + 128

    currentPixels[redIndex] = clamp(nextRed)
    currentPixels[greenIndex] = clamp(nextGreen)
    currentPixels[blueIndex] = clamp(nextBlue)
}

function processImage(){
    //console.log(Object.OriginalPixels);
    currentPixels = OriginalPixelsWorker.slice();

    for(let i = 0; i< srcImgHeightWorker; i++){
        for(let j = 0; j< srcImgWidthWorker; j++){
            addMaxContrast(j , i , 255);
        }
    }
    
    commitChanges();
}

function commitChanges(){
    for(let i = 0; i< imgDataWorker.data.length; i++){
        imgDataWorker.data[i] = currentPixels[i];
    }
    postMessage(imgDataWorker);

}


onmessage = function(Object){
    OriginalPixelsWorker = Object.data.OriginalPixels;
    imgDataWorker = Object.data.imgData;
    srcImgWidthWorker = Object.data.srcImageWidth;
    srcImgHeightWorker = Object.data.srcImageHeight;
    processImage()
}
