
export function fadeInOut() {
    // Fade out animation for the old view
    document.documentElement.animate(
      [
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
      ],
      {
        duration: 400,
        easing: 'ease',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)', // Applies to the old root view
      }
    );
  
    // Fade in animation for the new view
    document.documentElement.animate(
      [
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
      ],
      {
        duration: 400,
        easing: 'ease',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)', // Applies to the new root view
      }
    );
  }
  
export function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: 'translate(0, 0)',
        },
        {
          opacity: 0,
          transform: 'translate(-100px, 0)',
        },
      ],
      {
        duration: 400,
        easing: 'ease',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)',
      }
    )
  
    document.documentElement.animate(
      [
        {
          opacity: 0,
          transform: 'translate(100px, 0)',
        },
        {
          opacity: 1,
          transform: 'translate(0, 0)',
        },
      ],
      {
        duration: 400,
        easing: 'ease',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }
  