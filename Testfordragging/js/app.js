class ResponsiveEvent{
    constructor(){
        this.events = {}
    }
    initEvent(element,button = element,draggablelabel,dragId,dropId){
       if(!Object.keys(this.events).includes(element.id)){
       let event = new DragDrop(element,button,draggablelabel)
       this.events[element.id] = event
       let startEvent = new CustomEvent("ResponsiveDragStart",{detail:{tag:dragId}})
       event.SecureDrag()
       event.Dragstart(dragId,elem =>{
       startEvent.detail["element"] = elem
       event.drag_btn.dispatchEvent(startEvent)
       });
       let moveEvent = new CustomEvent("ResponsiveDragMove",{detail:{}})
       event.Dragmove(elem =>{
          moveEvent.detail["element"] = elem
          event.drag_btn.dispatchEvent(moveEvent)
       });
       let dropEvent = new CustomEvent("ResponsiveDrop",{detail:{drag:null,drop:null}})
       event.Drop(dropId,(dragelem,dropelem) =>{
        dropEvent.detail.drag = dragelem
        dropEvent.detail.drop = dropelem
        event.drag_btn.dispatchEvent(dropEvent)
       });
       let enterEvent = new CustomEvent("ResponsiveDragEnter",{detail:{enterElement:null}})
       event.Enter(dropId,enterelem =>{ 
        enterEvent.detail.enterElement = enterelem
        event.drag_btn.dispatchEvent(enterEvent)
       })
        let leaveEvent = new CustomEvent("ResponsiveDragLeave",{detail:{leaveElement:null}})
       event.Leave(dropId,leaveelem =>{ 
        leaveEvent.detail.leaveElement = leaveelem
        event.drag_btn.dispatchEvent(leaveEvent)
       })
       let overEvent = new CustomEvent("ResponsiveDragOver",{detail:{overElement:null}})
       event.Over(dropId,overelem =>{
         overEvent.detail.overElement = overelem
         event.drag_btn.dispatchEvent(overEvent)
       })
       }
    }
    enableEvent(element,event){
       this.events[element.id].enabled[event] = true
    }
}

class DragDrop{
    constructor(element,button = element,draggablelabel){
        this.dragId;
        this.dropId;
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
        this.draggablelabel = draggablelabel
        this.draggablestate;
        this.over;
        this.enter;
        this.leave = this.parent
        this.previousEntrance;
        this.enabled = {start:false,move:false,drop:false,enter:false,leave:false,over:false}
    }
    SecureDrag(){
        let items = ["-webkit-touch-callout","-webkit-user-drag","user-select"]
        items.forEach(item =>{
            this.my_id.style.setProperty(item,"none")
            this.drag_btn.style.setProperty(item,"none")
        })
    }
   Dragstart(dragId,callback){
    this.dragId = dragId
    this.drag_btn.addEventListener("pointerdown",(e)=>{
        if(this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.start){
            this.default_zIndex = this.my_id.style.zIndex
            this.my_id.style.zIndex = "999"
            this.parent = this.my_id.parentNode
            this.startPos = this.my_id.style.transform
            this.drag_btn.classList.add(this.dragId)
            if(e.cancelable && this.drag_btn.classList.contains(this.dragId)){
              e.preventDefault()
            }
            this.buttonX = e.layerX - ((this.drag_btn.clientWidth / 2) - 2)
            this.buttonY = e.layerY - ((this.drag_btn.clientHeight / 2) - 2.2)
            this.my_id.style.transform = `translate(${this.buttonX}px,${this.buttonY}px)`
            this.StartX = e.clientX
            this.StartY = e.clientY
            callback(this.my_id)
        }
    },{passive:false})
    }
    Dragmove(callback){
    document.addEventListener("pointermove",(e)=>{
        let mouseX = e.clientX
        let mouseY = e.clientY
    if(((mouseX <= 0 || mouseX >= window.innerWidth - 1)) || ((mouseY <= 0 || mouseY >= window.innerHeight - 1))){
        var pointerup = new PointerEvent("pointerup")
        this.drag_btn.dispatchEvent(pointerup)
    }    
    if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.move){
         e.preventDefault()   
        this.newX = this.buttonX + (e.clientX - this.StartX)
        this.newY = this.buttonY + (e.clientY - this.StartY)
        this.my_id.style.transform = `translate(${this.newX}px,${this.newY}px)`
        callback(this.my_id)
    }   
    })
    this.my_id.addEventListener("pointermove",(e)=>{
    if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.move){
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
    this.dropId = dropId
    this.drag_btn.addEventListener("pointerup",(e)=>{
        e.preventDefault()
        this.dropParent = parent.id
        if(this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.drop){
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
        if(this.my_id && this.dropParent){
         callback(this.my_id,this.dropParent)    
        }           
        }
    },{passive:false})  
   } 
   Enter(dropId,callback){
    document.addEventListener("pointermove",(e)=>{       
        if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.enter){
            this.my_id.style.visibility = "hidden" 
        let belowId = document.elementFromPoint(e.clientX,e.clientY)
        this.my_id.style.visibility = "visible"
            if(belowId && belowId != this.enter && belowId.classList.contains(dropId)){
              this.previousEntrance = this.enter
              callback(belowId)
            }
            this.enter = belowId
        }     
    })      
   }
   Leave(dropId,callback){
        document.addEventListener("pointermove",(e)=>{    
        if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.leave){
            this.my_id.style.visibility = "hidden" 
        let belowId = document.elementFromPoint(e.clientX,e.clientY)
        this.my_id.style.visibility = "visible"    
            if(belowId != this.previousEntrance && belowId.classList.contains(dropId)){
              this.previousEntrance = belowId
              callback(this.leave)
            }
            this.leave = this.previousEntrance
        }     
    }) 
   }
   Over(dropId,callback){
    document.addEventListener("pointermove",(e)=>{ 
      if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.over){
        this.my_id.style.visibility = "hidden" 
        let belowId = document.elementFromPoint(e.clientX,e.clientY)
        this.my_id.style.visibility = "visible"    
        if(belowId && belowId.classList.contains(dropId)){
            callback(belowId)
        }  
      }    
   })
   }
}



