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
      'AI-enabled Software Architecture',
      'Systems Design',
      'AI Agents',
      'Autonomous Platforms',
      'Robotics',
      'Control'
    ],
    keywordsTop: 302
  },

  /* Software-engineering V model: the design phases go down the left arm, coding is
   * the bottom, and the test phases climb the right arm. Each test phase checks the
   * design phase at the same height:
   *   Requirements Analysis <-> Acceptance Testing, System Design <-> System Testing,
   *   Architecture Design <-> Integration Testing, Module Design <-> Unit Testing.
   * Use an odd number of stages. */
  stages: [
    { name: 'Requirements Analysis', color: '#ff9f8e' },
    { name: 'System Design',         color: '#ffb089' },
    { name: 'Architecture Design',   color: '#ffc38a' },
    { name: 'Module Design',         color: '#ffd98f' },
    { name: 'Coding',                color: '#fff0c4' },
    { name: 'Unit Testing',          color: '#bfe6f2' },
    { name: 'Integration Testing',   color: '#9fd3f0' },
    { name: 'System Testing',        color: '#86bef0' },
    { name: 'Acceptance Testing',    color: '#8fa8f0' }
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
