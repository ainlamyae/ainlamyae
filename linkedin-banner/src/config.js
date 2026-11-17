/* LinkedIn banner: everything you may want to edit lives in this file.
 * Colours are any CSS colour. Sizes are pixels on the 1584 x 396 canvas. */
window.BANNER_CONFIG = {
  canvas: { width: 1584, height: 396 },

  /* The content block. The left 260 px stays empty for the LinkedIn profile photo. */
  content: { left: 260, width: 1306 },

  text: {
    headline: 'AI systems you can trust',
    subline: 'From Idea to Operation',
    keywords: [
      'Systems Design',
      'AI Software Architecture',
      'Generative AI',
      'Agentic Decision-Making',
      'Autonomous Platforms',
      'Robotics',
      'Real-Time Control'
    ],
    keywordsTop: 302
  },

  /* V model: the stages go down the left arm, the middle one is the bottom,
   * and the rest climb the right arm. Use an odd number of stages. */
  stages: [
    { name: 'Requirements',   color: '#ff9f8e' },
    { name: 'Data',           color: '#ffb089' },
    { name: 'Model',          color: '#ffc38a' },
    { name: 'Architecture',   color: '#ffd98f' },
    { name: 'Implementation', color: '#fff0c4' },
    { name: 'Validation',     color: '#bfe6f2' },
    { name: 'Deployment',     color: '#9fd3f0' },
    { name: 'Operation',      color: '#86bef0' },
    { name: 'Improvement',    color: '#8fa8f0' }
  ],

  shapes: { width: 140, height: 50, tip: 20, radius: 7, top: 76, drop: 40 },

  colors: {
    background: '#1f3a63',
    backgroundTop: '#27487a',
    backgroundBottom: '#1d3760',
    glow: 'rgba(86,128,190,.55)',
    headline: '#ffffff',
    subline: '#d6e4f7',
    keywords: '#b4cdec',
    keywordDot: '#7da0d1',
    stageText: '#13243f',
    link: 'rgba(214,228,247,.55)',
    linkDot: '#d6e4f7',
    vBand: 'rgba(255,255,255,.07)'
  },

  /* Background icon pattern */
  icons: {
    opacity: 0.115,
    stroke: '#dbe8fa',
    strokeWidth: 2.2,
    columns: 15,
    rows: 5,
    spacingX: 112,
    spacingY: 92,
    /* keep the keyword line free of icons */
    clearBox: { yMin: 270, yMax: 340, xMin: 260, xMax: 1560 }
  }
};
