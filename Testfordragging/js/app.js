class ResponsiveEvent{
    constructor(){
        this.events = {}
        this.CurrentlyDragging = null
    }
    initEvent(element,draggablelabel,dragId,dropId,button = element){
       if(!Object.keys(this.events).includes(element.id)){     
       let event = new DragDrop(element,button,draggablelabel)
       event.drag_btn.classList.add(draggablelabel)
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
       let dragendEvent = new CustomEvent("ResponsiveDragEnd")
       event.DragEnd(() =>{
         event.drag_btn.dispatchEvent(dragendEvent)
       })
       let dragcancelEvent = new CustomEvent("ResponsiveDragCancel",{detail:{dragElement:null,dragButton:null,dropElement:null}})
       event.DragCancel(dropId,(dragelem,button,dropElem) =>{
         dragcancelEvent.detail.dragElement = dragelem
         dragcancelEvent.detail.dragButton = button
         if(dropElem){
           dragcancelEvent.detail.dropElement = dropElem
         }
         event.drag_btn.dispatchEvent(dragcancelEvent)
       })
       }
    }
    enableEvent(element,event){
       this.events[element.id].enabled[event] = true
    }
    disableEvent(element,event){
       this.events[element.id].enabled[event] = false
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
        this.enabled = {start:false,move:false,drop:false,enter:false,leave:false,over:false,end:false,cancel:false}
        this.data;
        this.insidePage;
    }
    SecureDrag(){
        let items = ["-webkit-touch-callout","-webkit-user-drag","user-select"]
        items.forEach(item =>{
            this.my_id.style.setProperty(item,"none")
                if(this.my_id.id != this.drag_btn.id){
                  this.drag_btn.style.setProperty(item,"none")
                }                       
        })
    }
   Dragstart(dragId,callback){
    this.dragId = dragId
    this.drag_btn.addEventListener("pointerdown",(e)=>{
        if(this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.start){
            ResEvent.CurrentlyDragging = this.my_id
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
    if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.move){
         e.preventDefault()   
        if(mouseX > 0 && mouseX < window.innerWidth - 1){  
        this.newX = this.buttonX + (e.clientX - this.StartX)
        }
        if(mouseY > 0 && mouseY < window.innerHeight - 1){
        this.newY = this.buttonY + (e.clientY - this.StartY)
        }
        this.my_id.style.transform = `translate(${this.newX}px,${this.newY}px)`
        callback(this.my_id)
    }   
    })
    this.my_id.addEventListener("pointermove",(e)=>{
    if(this.drag_btn.classList.contains(this.dragId) && this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.move){
         e.preventDefault()
        let mouseX = e.clientX
        let mouseY = e.clientY
        if(mouseX > 0 && mouseX < window.innerWidth - 1){    
        this.newX = this.buttonX + (e.clientX - this.StartX)
        }
        if(mouseY > 0 && mouseY < window.innerHeight - 1){
        this.newY = this.buttonY + (e.clientY - this.StartY)
        }
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
          ResEvent.CurrentlyDragging = null
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
            if(belowId && !belowId.classList.contains(dropId)){
               let parent = belowId.parentNode
               if(parent.classList.contains(dropId)){
                 this.enter = parent
                  this.previousEntrance = belowId
                  callback(parent)    
               }
            }
            if(belowId && belowId.classList.contains(dropId)){
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
            if(this.previousEntrance){
              if(belowId && belowId != this.previousEntrance && this.previousEntrance.classList.contains(dropId)){
              callback(this.leave)
            }
            this.leave = this.previousEntrance
            }           
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
   DragEnd(callback){
      this.drag_btn.addEventListener("pointerup",()=>{
        if(this.drag_btn.draggable && this.enabled.end){
           callback()
        }
      })  
    }
   DragCancel(dropId,callback){
    document.addEventListener("pointerup",(e)=>{
        if(this.drag_btn.classList.contains(this.draggablelabel) && this.drag_btn.draggable && this.enabled.cancel){
            let mouseX = e.clientX
            let mouseY = e.clientY
           if(((mouseX <= 0 || mouseX >= window.innerWidth - 1)) || ((mouseY <= 0 || mouseY >= window.innerHeight - 1))){
            this.my_id.style.transform = this.startPos
            this.drag_btn.classList.remove(this.dragId)
            this.dropParent = null
            this.my_id.style.transform = ""        
            if(ResEvent.CurrentlyDragging.id == this.my_id.id){
              ResEvent.CurrentlyDragging = null  
              let dropAttempt = this.my_id.parentNode
               let target = dropAttempt.classList.contains(dropId) ? dropAttempt : null       
              callback(this.my_id,this.drag_btn,target)
            }               
           }
        }
    })
     this.drag_btn.addEventListener("pointerup",(e)=>{
      this.my_id.style.visibility = "hidden" 
       let belowId = document.elementFromPoint(e.clientX,e.clientY)
       this.my_id.style.visibility = "visible"
       if(belowId){
         if(!belowId.classList.contains(dropId) || this.parent.id == belowId.id){  
            this.drag_btn.classList.remove(this.dragId)
               this.my_id.style.transform = this.startPos
               this.dropParent = null
               this.my_id.style.transform = ""
               ResEvent.CurrentlyDragging = null
               let dropAttempt = belowId.parentNode
               let target = dropAttempt.classList.contains(dropId) ? dropAttempt : null
               callback(this.my_id,this.drag_btn,target)
        }
        } 
     })
   }
}

let ResEvent = new ResponsiveEvent()