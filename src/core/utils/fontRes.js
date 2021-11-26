const setRemUnit = () => {
    const docEl = document.documentElement;
    // IPhone6下750像素来设计，实际像素375px，1rem为50px
    const rem = docEl.clientWidth / 7.5;
    
    docEl.style.fontSize =  `${rem}px`;
    };
    
    const pageShowCallback = (e) => {
    if (e.persisted) {
    setRemUnit();
    }
    };
    
    document.addEventListener('DOMContentLoaded', setRemUnit, false);
    
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit, false);
    
    // reset rem unit on page show
    window.addEventListener('pageshow', pageShowCallback, false);
    
    export default setRemUnit;