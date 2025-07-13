class DragDrop{
    constructor(element,button = element){
        this.dragId;
        this.drag_btn = button
        this.my_id = element
        this.parent = this.my_id.parentNode
        this.StartX;
        this.StartY;
        this.buttonX;
        this.buttonY;
        this.newX;
        this.newY;
        this.startPos;
        this.dropParent = null;
        this.default_zIndex;
        this.zoomLevel;
    }
   Dragstart(dragId,callback){
    this.dragId = dragId 
    this.drag_btn.addEventListener("pointerdown",(e)=>{
        if(!this.drag_btn.draggable){
            this.default_zIndex = this.my_id.style.zIndex
            this.my_id.style.zIndex = "999"
            this.parent = this.my_id.parentNode
            this.startPos = this.my_id.style.transform
            this.drag_btn.classList.add(this.dragId)
            e.preventDefault()
            this.buttonX = e.layerX - ((this.drag_btn.clientWidth / 2) - 2)
            this.buttonY = e.layerY - ((this.drag_btn.clientHeight / 2) - 2.2)
            this.my_id.style.transform = `translate(${this.buttonX}px,${this.buttonY}px)`
            this.StartX = e.clientX
            this.StartY = e.clientY
            callback(this.my_id)
        }
    })
    }
    Dragmove(callback){
    document.addEventListener("pointermove",(e)=>{
        let mouseX = e.clientX
        let mouseY = e.clientY
    if(((mouseX <= 0 || mouseX >= window.innerWidth - 1)) || ((mouseY <= 0 || mouseY >= window.innerHeight - 1))){
        var pointerup = new PointerEvent("pointerup")
        this.drag_btn.dispatchEvent(pointerup)
    }    
    if(this.drag_btn.classList.contains(this.dragId) && !this.drag_btn.draggable){
         e.preventDefault()       
        this.newX = this.buttonX + (e.clientX - this.StartX)
        this.newY = this.buttonY + (e.clientY - this.StartY)
        this.my_id.style.transform = `translate(${this.newX}px,${this.newY}px)`
        callback(this.my_id)
    }   
    })
    this.my_id.addEventListener("pointermove",(e)=>{
    if(this.drag_btn.classList.contains(this.dragId) && !this.drag_btn.draggable){
         e.preventDefault()   
        this.newX = this.buttonX + (e.clientX - this.StartX)
        this.newY = this.buttonY + (e.clientY - this.StartY)
        this.my_id.style.transform = `translate(${this.newX}px,${this.newY}px)`       
        callback(this.my_id)
    }  
    })
    window.addEventListener("touchmove", e =>{
    if(e.cancelable && this.drag_btn.classList.contains(this.dragId)){
      e.preventDefault()
    }
    this.newX = this.buttonX + (e.targetTouches[0] - this.StartX)
    this.newY = this.buttonY + (e.targetTouches[0] - this.StartY)
    this.my_id.style.transform = `translate(${this.newX}px,${this.newY}px)`   
    callback(this.my_id)
    },{passive:false}) 
   }
   Drop(dropId,callback){
    this.drag_btn.addEventListener("pointerup",(e)=>{
        this.dropParent = parent.id
        if(!this.drag_btn.draggable){
        this.drag_btn.classList.remove(this.dragId)
        this.my_id.style.visibility = "hidden" 
        let belowId = document.elementFromPoint(e.clientX,e.clientY)
        this.my_id.style.visibility = "visible"
        if(belowId){
         if(!belowId.classList.contains(dropId) || this.parent.id == belowId.id){  
            this.drag_btn.classList.remove(this.dragId)
               this.my_id.style.transform = this.startPos
               this.dropParent = null
        }else if(belowId.classList.contains(dropId)){
            this.dropParent = belowId
            this.my_id.style.transform = ""
        }
        } 
        this.my_id.style.zIndex = this.default_zIndex
        callback(this.my_id,this.dropParent)       
        }
    })  
   }
}

var elements = document.querySelectorAll(".popup")
elements.forEach(item =>{
var drag_btn = document.getElementById(item.firstElementChild.id)
let my_id = item;
let resultpopup = new DragDrop(my_id,drag_btn);
resultpopup.Dragstart("dragging",elem =>{
    resultpopup.drag_btn.style.backgroundColor = "red"
    //console.log(elem)
});

resultpopup.Dragmove(elem =>{
    //console.log(elem.id)
});

resultpopup.Drop("container",(dragelem,dropelem) =>{
    if(dragelem && dropelem){
    var parent = dropelem
    var child = dragelem
    parent.appendChild(child)
    }
    resultpopup.drag_btn.style.backgroundColor = "green"
});
})