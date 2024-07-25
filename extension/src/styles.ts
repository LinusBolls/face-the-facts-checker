export function loadStyles() {
  document.head.insertAdjacentHTML(
    "beforeend",
    `<style data-facts-slot="styles">
      .facts-fact {
        pointer-events: auto;
    
        position: relative;
        display: flex;
        flex-direction: column;
    
        width: 288px;
    
        background: rgba(0, 0, 0, 0.8);
    
        border-left: 4px solid #3dc2ff;
        border-radius: 4px;
    
        font-family: 'YouTube Noto', Roboto, Arial, Helvetica, sans-serif;
    
        animation: toast 0.5s normal forwards ease-in-out;
    
        animation-iteration-count: 1;
      }
    
    
    
    
    
    @keyframes toast {
      from {
          opacity: 0;
          transform: translateX(calc(-100% - 8px));
      }
      to {
          opacity: 1;
          transform: translateX(0);
      }
  }
      .facts-icon-button {
        background: none; 
        border: none; 
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        width: auto; 
        height: auto;
  
        border-radius: 99px;
  
        transition: background 100ms;
      }
      .facts-icon-button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
  .facts-pill-button {
      padding: 0 10px;
  
      background: none;
      border: 1px solid #aaa;
      color: #eee;
  
      border-radius: 99px;
  
      font-size: 11px;
      line-height: 20px;
      font-weight: 400;
  
      cursor: pointer;
  
      transition: background 100ms;
  }
  .facts-pill-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
    .facts-pill-button.facts-pill-button--active {
      border-color: transparent;
      background: #eee;
      color: #222;
    }
  </style>`
  );
}
