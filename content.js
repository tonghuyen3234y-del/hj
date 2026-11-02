// Personal content lives here. Empty lists stay empty until you add real material.
export const profile = {
  name: { zh: '李慧洁', en: 'Huijie Li' },
  nickname: { zh: '慧洁', en: 'Huijie' },
  site: "Huijie's Space", mark: 'HJ.',
  slogan: 'Stay curious. Keep creating.',
  sloganZh: '保持好奇，持续创造。',
  role: { zh: 'AI 探索者 / 创意实践者 / 科技写作者', en: 'AI Explorer / Creative Thinker / Tech Writer' },
  keywords: { zh: ['AI', 'Agent', '创造力', '好奇心', '独立思考'], en: ['AI', 'Agents', 'Creativity', 'Curiosity', 'Independent thinking'] },
  about: {
    zh: ['你好，我是李慧洁，一个喜欢折腾 AI 的人。', '热衷于探索 AI 产品、智能体与技术创新，尝试用技术把有趣的想法变成现实。', '喜欢新鲜事物，保持好奇与独立思考，也喜欢用文字记录对科技与生活的观察。'],
    en: ["Hi, I’m Huijie Li, an explorer who loves experimenting with AI.", 'I explore AI products, agents, and emerging technologies, turning interesting ideas into things that work.', 'Drawn to new possibilities, I stay curious, think independently, and write about technology and everyday life.']
  },
  town: { zh: '好奇小镇', en: "Huijie's Space" },
  townIntro: { zh: '一个由好奇心构建的小世界，收藏灵感、想象力与尚未发生的可能。', en: 'A little world built on curiosity, home to inspiration, imagination, and possibilities yet to unfold.' },
  publication: {
    zh: '慢变量AI', en: 'Slow Variables · AI & Beyond',
    role: { zh: '公众号主理人 / 科技写作者', en: 'WeChat Publication Creator / Tech Writer' },
    slogan: { zh: '技术在加速，思考不必赶路。', en: 'Technology moves fast. Thought can take its time.' },
    intro: { zh: ['「慢变量AI」是我记录 AI 技术与独立思考的地方。', '关注大模型、Agent、AI 产品与科技趋势，也关注技术发展背后人与社会的变化。', '希望在快速变化的时代，保持好奇，慢慢形成自己的判断。'], en: ['Slow Variables is where I write about AI and think things through independently.', 'I follow large language models, agents, AI products, and technology trends — alongside the people and social changes behind them.', 'In a fast-changing world, I hope to stay curious and take the time to form my own perspective.'] },
    directions: [
      { zh: ['AI 前沿', '大模型、Agent 与技术趋势'], en: ['AI frontiers', 'Models, agents, and emerging technologies'] },
      { zh: ['产品观察', '有趣的 AI 产品与创新应用'], en: ['Product notes', 'Interesting AI products and creative applications'] },
      { zh: ['深度思考', '技术、社会与人的关系'], en: ['Deeper thoughts', 'Technology, society, and the people in between'] },
      { zh: ['成长记录', '学习、探索与个人感悟'], en: ['Learning journal', 'Learning, exploration, and personal reflections'] }
    ]
  },
  contact: {
    zh: ['喜欢 AI、技术和有趣的想法，也期待认识更多同样充满好奇心的人。', '如果你有奇妙的创意，欢迎一起交流。'],
    en: ['I love AI, technology, and interesting ideas, and look forward to meeting people who share that curiosity.', 'Have a wonderful idea? Let’s talk.']
  },
  // Add only links and addresses you want to make public.
  links: [],
  articles: [
  {
    "title": {
      "zh": "DeepSeek和MiniMax正面交锋：便宜的AI，真的更划算吗？",
      "en": "DeepSeek vs. MiniMax: Is cheaper AI really better value?"
    },
    "url": "https://mp.weixin.qq.com/s/-7A6BenYm8seHDT0keUjEQ",
    "platform": {
      "zh": "微信公众号 · 慢变量AI",
      "en": "WECHAT · SLOW VARIABLES"
    }
  },
  {
    "title": {
      "zh": "AI已经可以自主写代码，大学四年究竟应该学什么？",
      "en": "AI can already code on its own. What should four years at university teach us?"
    },
    "url": "https://mp.weixin.qq.com/s/yjDNopiw4RT6CGZwwFwl-Q",
    "platform": {
      "zh": "微信公众号 · 慢变量AI",
      "en": "WECHAT · SLOW VARIABLES"
    }
  },
  {
    "title": {
      "zh": "每天刷红果2小时，我们离《娱乐至死》还有多远？",
      "en": "Two hours of Hongguo a day: How close are we to Amusing Ourselves to Death?"
    },
    "url": "https://mp.weixin.qq.com/s/63wP56oHuWgKfjFgUZLOzA",
    "platform": {
      "zh": "微信公众号 · 慢变量AI",
      "en": "WECHAT · SLOW VARIABLES"
    }
  },
  {
    "title": {
      "zh": "DeepSeek让AI指挥AI，看完技术原文我反而后背发凉",
      "en": "DeepSeek lets AI direct AI. Reading the technical paper gave me chills."
    },
    "url": "https://mp.weixin.qq.com/s/TY5RQpJ6Zyw6dyVXN6H_3g",
    "platform": {
      "zh": "微信公众号 · 慢变量AI",
      "en": "WECHAT · SLOW VARIABLES"
    }
  }
],
  projects: [],
  experiences: []
};
export const buildings = [
  {id:'about', zh:['印刷所','关于我'], en:['The Print House','About me']},
  {id:'resume', zh:['档案馆','经历'], en:['The Archive','Experience']},
  {id:'projects', zh:['工坊车库','项目'], en:['The Workshop','Projects']},
  {id:'writing', zh:['慢变量书报亭','慢变量AI'], en:['Slow Variables','Writing']},
  {id:'contact', zh:['邮局','联系'], en:['The Post Office','Connect']},
  {id:'channels', zh:['灵感放映厅','灵感空间'], en:['The Screening Room','Inspiration']}
];
export const words = {
  zh: {
    nav:['入口','探索','主页','关于','项目','文章','经历','联系'], switch:'中文 / EN',
    gateKicker:'检票口 · 请选一张票', gateIntro:'选择一条路线，走进我的个人小镇：直接看主页，或者开车探索。',
    direct:'简明模式', directDesc:'直接进入主页，认识我、慢变量AI，以及正在酝酿的想法。', directCta:'进入主页',
    drive:'探索模式', driveDesc:'开一辆橙色小车，逛逛好奇小镇的六间小屋。', driveCta:'开车逛好奇小镇',
    reading:'阅读票', driving:'驾驶票', station:'站点', duration:'约 3 分钟', seat:'座位 随意', desktop:'仅限桌面',
    remember:'记住我的选择', remembered:'已记住', continue:'继续进入', choose:'重新选择', clear:'清除选择',
    heroKicker:'个人空间 · AI 探索 · 科技写作', heroIntro:'探索 AI，记录灵感，把有趣的想法变成现实。', connect:'联系我',
    day:'昼', night:'夜', townCaption:'六栋小屋，收藏我的好奇心。点一间，进去看看。', townScale:'HJ. · 北京时间，同步昼夜',
    about:'关于', aboutLink:'看完整关于页', channels:'灵感空间', channelsIntro:'AI、Agent、创造力、好奇心、独立思考。',
    experience:'经历', experienceLink:'打开经历页', projects:'项目', projectsLink:'打开项目页', writing:'文章', writingLink:'看文章页',
    empty:'有趣的事情，正在发生。', emptyEn:'Something interesting is on the way.',
    platform:'微信公众号', pubCopy:'复制公众号名称', copied:'已复制', copyFailed:'请手动复制：慢变量AI',
    contact:'联系', postcard:'明信片', hello:'嗨，慧洁：', cardLine1:'路过你的好奇小镇，', cardLine2:'想和你聊聊 ______ 。', cardFrom:'—— 同样好奇的我', sendTo:'寄给',
    backTop:'回到顶部', colophon:'版权页', imprint:'好奇小镇 · HJ. 出品', craft:'网点、印章与车票，收藏一点创造的痕迹',
    explore:'探索小镇', loading:'正在布置六间小屋…', ready:'小镇准备好了', start:'WASD 开始',
    driveIntro:'一座小镇，六扇门。慢慢开，随处看看。', drivingHint:'WASD 或方向键移动 · Shift 加速 · 空格刹车 · E 查看 · R 重置',
    nightToggle:'切换夜景', dayToggle:'切换白天', overview:'全岛视角', carView:'回到车旁', tour:'带我逛逛', takeWheel:'接过方向盘', discovered:'已发现',
    mapHint:'点一间小店，自动开过去 ↗', near:'靠近', viewHint:'按 E 查看', visiting:'到访', openPage:'去主页看完整内容', close:'关闭',
    mobileTitle:'带上键盘，来小镇兜风', mobileDesc:'开车探索适合在桌面端体验。你仍然可以从这里走进每一间小屋。',
    reducedTitle:'用安静的方式，走进小镇', reducedDesc:'已按你的减少动态效果偏好暂停 3D 场景，可通过下方六个入口继续浏览。',
    fallbackTitle:'小镇暂时未能启动', fallbackDesc:'当前浏览器未能加载 3D 场景，可以通过下方入口继续浏览。', retry:'重新加载',
    speed:'时速', gearIdle:'空挡', gearDrive:'前进', gearReverse:'倒车', gearBrake:'制动', gearBoost:'加速',
    roads:{road:'街道',sidewalk:'人行道',plaza:'广场',grass:'草地'},
    tourTo:'正在前往', orbitHint:'拖动环看 · 滚轮缩放', archiveEmpty:'留一点空白，给未来的故事。',
    notFound:'这条小路还没有通往任何地方。', backHome:'返回主页'
  },
  en: {
    nav:['Entrance','Explore','Home','About','Projects','Writing','Experience','Connect'], switch:'EN / 中文',
    gateKicker:'TICKET OFFICE · PICK YOUR ROUTE', gateIntro:'Two ways into my little world: read the homepage, or take the scenic drive.',
    direct:'The direct route', directDesc:'Meet me, discover Slow Variables, and find ideas taking shape.', directCta:'Enter the homepage',
    drive:'The scenic route', driveDesc:'Take a little orange car around the six houses of my curious town.', driveCta:'Drive around town',
    reading:'READ', driving:'DRIVE', station:'ROUTE', duration:'ABOUT 3 MIN', seat:'SEAT ANYWHERE', desktop:'DESKTOP ONLY',
    remember:'Remember my choice', remembered:'Remembered', continue:'Continue', choose:'Choose again', clear:'Clear choice',
    heroKicker:'PERSONAL SPACE · AI EXPLORATION · WRITING', heroIntro:'Exploring AI, collecting inspiration, and bringing interesting ideas to life.', connect:'Let’s connect',
    day:'Day', night:'Night', townCaption:'Six little houses, a world of curiosity. Pick a door and step inside.', townScale:'HJ. · BEIJING TIME, DAY & NIGHT',
    about:'About', aboutLink:'More about me', channels:'A space for ideas', channelsIntro:'AI, agents, creativity, curiosity, independent thinking.',
    experience:'Experience', experienceLink:'Open the archive', projects:'Projects', projectsLink:'Visit the workshop', writing:'Writing', writingLink:'More from Slow Variables',
    empty:'Something interesting is on the way.', emptyEn:'有趣的事情，正在发生。',
    platform:'WECHAT PUBLICATION', pubCopy:'Copy publication name', copied:'Copied', copyFailed:'Copy manually: 慢变量AI',
    contact:'Connect', postcard:'POST CARD', hello:'Hi, Huijie,', cardLine1:'I wandered into your little world', cardLine2:'and would love to talk about ______ .', cardFrom:'— A fellow curious mind', sendTo:'TO',
    backTop:'Back to top', colophon:'COLOPHON', imprint:'A LITTLE WORLD BY HJ.', craft:'Halftones, stamps, and tickets. Small traces of making.',
    explore:'Explore the town', loading:'Getting the six houses ready…', ready:'Your little world is ready', start:'WASD · LET’S GO',
    driveIntro:'One little town. Six open doors. Take your time and look around.', drivingHint:'WASD / arrows · Shift to boost · Space to brake · E to view · R to reset',
    nightToggle:'Switch to night', dayToggle:'Switch to day', overview:'Island view', carView:'Follow the car', tour:'Show me around', takeWheel:'Take the wheel', discovered:'DISCOVERED',
    mapHint:'Pick a house to drive there ↗', near:'Near', viewHint:'press E to enter', visiting:'VISITING', openPage:'Read more on the homepage', close:'Close',
    mobileTitle:'Bring a keyboard. Take a little drive.', mobileDesc:'The driving experience is designed for desktop. You can still visit every house using the links below.',
    reducedTitle:'A quieter way into the town', reducedDesc:'The 3D scene is paused to respect your reduced-motion preference. All six doors remain open below.',
    fallbackTitle:'The town couldn’t start this time', fallbackDesc:'The 3D scene could not load in this browser. The doors below are still open.', retry:'Try again',
    speed:'SPEED', gearIdle:'Neutral', gearDrive:'Drive', gearReverse:'Reverse', gearBrake:'Braking', gearBoost:'Boost',
    roads:{road:'Street',sidewalk:'Pavement',plaza:'Plaza',grass:'Grass'},
    tourTo:'Heading to', orbitHint:'Drag to orbit · Scroll to zoom', archiveEmpty:'A little space for stories yet to come.',
    notFound:'This little path doesn’t lead anywhere yet.', backHome:'Back to the homepage'
  }
};
