/* 商品数据（列表 + 商详扩展），PRD 示例 */

export type TagKind = "good" | "note" | "plain";

export type AromaTone = "green" | "yellow" | "purple";

export type CakeDetail = {
  sizePeople: string;
  addr: string;
  sold: string;
  wants: number;
  profile: string;
  overall: {
    score: number;
    overPercent: number;
    taste: number;
    ingredient: number;
    value: number;
  };
  dims: { name: string; score: number; desc: string }[];
  aroma: { stage: string; timing: string; desc: string; summary: string; tone: AromaTone }[];
  textureLayers: { name: string; taste: string; mouthfeel: string }[];
  purchase: {
    channel: string;
    cycle: string;
    address: string;
    custom: string;
    storage: string;
  };
  ingredients: {
    labels: { label: string; kind: TagKind }[];
    cream: string;
    sugar: string;
    additives: string;
    allergens: string;
    source: string;
  };
  source: string;
  goodReviews: string[];
  badReviews: { text: string; count: number }[];
};

export type Cake = {
  id: string;
  name: string;
  brand: string;
  size: string;
  addr: string;
  price: number;
  rating: number;
  reviews: number;
  heatTag: string;
  heatClass: string;
  art: string;
  silhouetteColor: string;
  booking: string;
  bookingGroup: string;
  tags: { label: string; kind: TagKind }[];
  flavors: string[];
  detail: CakeDetail;
};

export const cakes: Cake[] = [
  {
    id: "c1",
    name: "咸法酪玫瑰草莓千层",
    brand: "Sillage",
    size: "6寸",
    addr: "静安区陕西北路",
    price: 238,
    rating: 4.2,
    reviews: 128,
    heatTag: "顶流",
    heatClass: "bg-rose text-white",
    art: "bg-gradient-to-br from-[#f6e4e1] to-[#e5beb8]",
    silhouetteColor: "text-[#c48f8a]",
    booking: "提前2天订",
    bookingGroup: "提前2天",
    tags: [
      { label: "纯动物奶油", kind: "good" },
      { label: "低糖", kind: "good" },
      { label: "含玫瑰", kind: "note" },
    ],
    flavors: ["酸甜果味", "花香调", "咸甜口"],
    detail: {
      sizePeople: "6寸（2-4人）",
      addr: "静安区陕西北路446号",
      sold: "已售 1.2k+",
      wants: 328,
      profile:
        "咸法酪的咸柔化了草莓的甜，玫瑰香在尾调轻轻抬起——一口咸甜果香、层次分明的千层。",
      overall: { score: 4.2, overPercent: 82, taste: 4.3, ingredient: 4.0, value: 4.1 },
      dims: [
        { name: "甜度", score: 2.3, desc: "甜度偏低，咸法酪的咸中和了草莓甜" },
        { name: "风味", score: 4.4, desc: "咸甜交织 + 草莓酸甜 + 玫瑰花香，层次丰富有记忆点" },
        { name: "口感", score: 4.0, desc: "千层饼皮薄而柔软，奶油绵密，入口即化" },
        { name: "湿润度", score: 4.5, desc: "草莓多汁，奶油层湿润，整体水润不干" },
        { name: "浓郁度", score: 3.4, desc: "芝士香与玫瑰香交织，浓郁但不厚重" },
        { name: "奶油占比", score: 2.9, desc: "咸法酪层适中，与饼皮草莓比例均衡" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "草莓的清新果酸 · 咸法酪的淡淡咸香 · 千层饼皮的奶香",
          summary: "明亮、开胃，第一印象是“咸甜”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "动物奶油的绵密奶香 · 玫瑰酱的花香浮现 · 草莓果肉的多汁酸甜",
          summary: "咸甜交织、花香抬升，层次分明",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "玫瑰的幽香残留 · 法酪的微咸回甘 · 草莓的果甜尾韵",
          summary: "持久、优雅，玫瑰香是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 奶油与草莓",
          taste: "动物奶油的微咸奶香 + 草莓鲜甜",
          mouthfeel: "奶油绵密轻盈，草莓多汁爆浆",
        },
        {
          name: "中层 · 千层饼皮",
          taste: "蛋奶香，微微带咸",
          mouthfeel: "皮薄柔软，一层层口感分明",
        },
        {
          name: "底层 · 咸法酪夹心",
          taste: "法酪的咸鲜与微酸",
          mouthfeel: "扎实细腻，压得住甜",
        },
      ],
      purchase: {
        channel: "Sillage 微信小程序",
        cycle: "提前 2 天预订，当日 16:00 截单",
        address: "静安区陕西北路446号，每日 11:30-19:00 可自提",
        custom: "写字（免费）、换夹心（+¥20）、调甜度（3 档）；不支持造型定制",
        storage: "冷藏取出室温放置 5-10 分钟，24 小时内食用最佳",
      },
      ingredients: {
        labels: [
          { label: "纯动物奶油", kind: "good" },
          { label: "低糖配方", kind: "good" },
          { label: "无防腐剂", kind: "good" },
          { label: "无人工色素", kind: "good" },
          { label: "含玫瑰酱", kind: "note" },
          { label: "含乳制品", kind: "note" },
        ],
        cream: "100% 动物稀奶油（乳脂≥35%）",
        sugar: "低糖（约 12°Brix）",
        additives: "仅含吉利丁（凝固剂），无防腐剂 / 人工香精",
        allergens: "含乳制品、鸡蛋、微量坚果（玫瑰酱基底）",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 128 条评价",
      goodReviews: [
        "咸甜平衡做得好，芝士咸味中和了草莓的甜，不齁",
        "千层饼皮薄而均匀，一层一层口感分明",
        "奶油轻盈不糊嘴，动物奶油口感明显",
        "玫瑰花香自然，不是香精味，搭配草莓很高级",
      ],
      badReviews: [
        { text: "奶油偏厚重，吃多了容易腻", count: 3 },
        { text: "冬季草莓偏酸，品质随季节波动", count: 2 },
        { text: "冷藏后饼皮稍硬，建议回温再吃", count: 2 },
      ],
    },
  },
  {
    id: "c2",
    name: "焙茶生巧慕斯",
    brand: "POURNIL",
    size: "5寸",
    addr: "黄浦区茂名南路",
    price: 198,
    rating: 4.5,
    reviews: 96,
    heatTag: "秒罄",
    heatClass: "bg-primary text-white",
    art: "bg-gradient-to-br from-[#e7efe4] to-[#c7d8bd]",
    silhouetteColor: "text-[#5f7d5c]",
    booking: "提前1天订",
    bookingGroup: "提前1天",
    tags: [
      { label: "低糖", kind: "good" },
      { label: "无防腐剂", kind: "good" },
      { label: "含乳制品", kind: "note" },
    ],
    flavors: ["茶味清苦", "巧克力浓郁"],
    detail: {
      sizePeople: "5寸（2-3人）",
      addr: "黄浦区茂名南路",
      sold: "已售 800+",
      wants: 156,
      profile:
        "焙茶的微苦先声夺人，生巧的丝滑紧随其后——一口苦甜回甘、茶香悠长的慕斯。",
      overall: { score: 4.5, overPercent: 91, taste: 4.4, ingredient: 4.6, value: 4.2 },
      dims: [
        { name: "甜度", score: 2.6, desc: "焙茶微苦回甘，甜度克制" },
        { name: "风味", score: 4.3, desc: "焙茶香与生巧层层递进，尾韵悠长" },
        { name: "口感", score: 4.4, desc: "慕斯绵密如云，生巧丝滑，入口即化" },
        { name: "湿润度", score: 4.2, desc: "整体湿润，生巧层略稠" },
        { name: "浓郁度", score: 4.5, desc: "焙茶 + 生巧双浓郁，但不厚重" },
        { name: "奶油占比", score: 3.2, desc: "奶油适中，慕斯为主体" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "焙茶的烘焙香 · 生巧的可可气息 · 奶油的柔润奶香",
          summary: "沉静、微苦，第一印象是“茶”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "焙茶的茶韵回甘 · 生巧的丝滑甜润 · 奶油的中和",
          summary: "苦甜平衡、层层递进",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "焙茶的悠长回甘 · 可可的微苦残韵",
          summary: "持久、深邃，茶回甘是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 焙茶慕斯",
          taste: "焙茶清香微苦",
          mouthfeel: "绵密如云，入口即化",
        },
        {
          name: "中层 · 生巧层",
          taste: "可可醇苦带甜",
          mouthfeel: "丝滑稠厚，缓慢化开",
        },
        {
          name: "底层 · 蛋糕底",
          taste: "麦香蛋香",
          mouthfeel: "湿润服帖，收口干净",
        },
      ],
      purchase: {
        channel: "POURNIL 微信小程序",
        cycle: "提前 1 天预订，当日 18:00 截单",
        address: "黄浦区茂名南路，每日 11:00-19:00 可自提",
        custom: "可调甜度（3 档）；不支持造型定制",
        storage: "冷藏取出回温 5 分钟，24 小时内食用最佳",
      },
      ingredients: {
        labels: [
          { label: "低糖配方", kind: "good" },
          { label: "无防腐剂", kind: "good" },
          { label: "含乳制品", kind: "note" },
        ],
        cream: "100% 动物稀奶油（乳脂≥35%）",
        sugar: "低糖（约 11°Brix）",
        additives: "仅含吉利丁（凝固剂），无防腐剂 / 人工香精",
        allergens: "含乳制品、鸡蛋、大豆",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 96 条评价",
      goodReviews: [
        "焙茶香很正，不是香精味，回甘明显",
        "慕斯轻盈，生巧丝滑，整体不甜腻",
        "低糖配方吃着没负担",
      ],
      badReviews: [
        { text: "生巧层偏稠，冬天口感更扎实", count: 3 },
        { text: "分量偏小，两人吃刚好", count: 4 },
      ],
    },
  },
  {
    id: "c3",
    name: "经典原味瑞士卷",
    brand: "Tinyroll",
    size: "切块",
    addr: "徐汇区安福路",
    price: 42,
    rating: 4.3,
    reviews: 210,
    heatTag: "热糕",
    heatClass: "bg-accent text-white",
    art: "bg-gradient-to-br from-[#f7ebd3] to-[#ecd8ab]",
    silhouetteColor: "text-[#b0824f]",
    booking: "周日13点抢",
    bookingGroup: "预约制/抢购",
    tags: [
      { label: "纯动物奶油", kind: "good" },
      { label: "无人工色素", kind: "good" },
    ],
    flavors: ["咸甜口"],
    detail: {
      sizePeople: "切块（1-2人）",
      addr: "徐汇区安福路",
      sold: "已售 3k+",
      wants: 412,
      profile:
        "蛋香和奶香干干净净，甜度点到为止——一块本本分分、越吃越舒服的原味卷。",
      overall: { score: 4.3, overPercent: 86, taste: 4.2, ingredient: 4.1, value: 4.4 },
      dims: [
        { name: "甜度", score: 2.8, desc: "清甜不齁，原味本香" },
        { name: "风味", score: 3.6, desc: "蛋香 + 奶香干净利落，胜在平衡" },
        { name: "口感", score: 4.1, desc: "戚风松软，卷制紧实不散" },
        { name: "湿润度", score: 4.0, desc: "奶油滋润，胚体略干但不噎" },
        { name: "浓郁度", score: 2.9, desc: "清淡挂，奶香为主" },
        { name: "奶油占比", score: 3.5, desc: "奶油比例偏高，近似轻乳酪口感" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "新鲜鸡蛋的蛋香 · 动物奶油的奶香",
          summary: "干净、纯粹，第一印象是“本味”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "戚风的麦香 · 奶油的反腻清甜",
          summary: "平衡、清爽，甜而不齁",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "淡淡的奶香残留 · 蛋香回口",
          summary: "简短、干净，无负担",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 奶油",
          taste: "清甜奶香",
          mouthfeel: "轻盈不糊嘴",
        },
        {
          name: "中层 · 戚风胚",
          taste: "蛋香麦香",
          mouthfeel: "松软有弹性，卷制紧实",
        },
        {
          name: "外层 · 卷皮",
          taste: "微焦蛋香",
          mouthfeel: "略带韧劲，不散不裂",
        },
      ],
      purchase: {
        channel: "Tinyroll 微信小程序（周日 13:00 放号）",
        cycle: "每周日 13:00 放号抢订",
        address: "徐汇区安福路，周日 13:00-19:00 自提",
        custom: "不支持定制",
        storage: "当日食用最佳，冷藏不超过 48 小时",
      },
      ingredients: {
        labels: [
          { label: "纯动物奶油", kind: "good" },
          { label: "无人工色素", kind: "good" },
        ],
        cream: "动物稀奶油（乳脂≥35%）",
        sugar: "正常（约 16°Brix）",
        additives: "无防腐剂、无人工香精",
        allergens: "含乳制品、鸡蛋、麸质",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 210 条评价",
      goodReviews: [
        "胚体松软，奶油轻盈不糊嘴",
        "切块大小友好，一人食刚好",
        "原味干净，吃得出蛋香",
      ],
      badReviews: [
        { text: "放号即秒没，抢购体验一般", count: 12 },
        { text: "下午到店常售罄，需要蹲点", count: 5 },
      ],
    },
  },
  {
    id: "c4",
    name: "茉莉青提千层",
    brand: "Haku",
    size: "6寸",
    addr: "静安区巨鹿路",
    price: 218,
    rating: 4.4,
    reviews: 87,
    heatTag: "高颜值",
    heatClass: "bg-matcha text-white",
    art: "bg-gradient-to-br from-[#e4ebe3] to-[#cfe0d2]",
    silhouetteColor: "text-[#6e8b6b]",
    booking: "提前2天订",
    bookingGroup: "提前2天",
    tags: [
      { label: "纯动物奶油", kind: "good" },
      { label: "含乳制品", kind: "note" },
    ],
    flavors: ["花香调", "酸甜果味"],
    detail: {
      sizePeople: "6寸（2-4人）",
      addr: "静安区巨鹿路",
      sold: "已售 600+",
      wants: 189,
      profile:
        "茉莉先香，青提后酸，奶油垫底——一口清清雅雅、果香四溢的春日千层。",
      overall: { score: 4.4, overPercent: 88, taste: 4.3, ingredient: 4.2, value: 4.3 },
      dims: [
        { name: "甜度", score: 2.5, desc: "青提微酸中和甜度，清爽" },
        { name: "风味", score: 4.2, desc: "茉莉香清雅，与青提果香衔接自然" },
        { name: "口感", score: 4.2, desc: "饼皮薄软，层次分明" },
        { name: "湿润度", score: 4.3, desc: "果肉多汁，整体水润" },
        { name: "浓郁度", score: 3.0, desc: "清香挂，不厚重" },
        { name: "奶油占比", score: 3.1, desc: "奶油与果肉比例均衡" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "茉莉的清雅花香 · 青提的青涩果香",
          summary: "清新、明亮，第一印象是“花香”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "青提果肉的多汁酸甜 · 奶油的柔润奶香",
          summary: "果香饱满、酸甜平衡",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "茉莉的幽香残留 · 青提的微酸尾韵",
          summary: "持久、清雅，花香是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 奶油与青提",
          taste: "青提爆汁酸甜 + 奶油微甜",
          mouthfeel: "果肉弹嫩，汁水丰盈",
        },
        {
          name: "中层 · 千层饼皮",
          taste: "蛋奶香",
          mouthfeel: "薄软有韧劲",
        },
        {
          name: "底层 · 茉莉奶油",
          taste: "茉莉花香融于奶香",
          mouthfeel: "柔滑清透",
        },
      ],
      purchase: {
        channel: "Haku 微信小程序",
        cycle: "提前 2 天预订，当日 16:00 截单",
        address: "静安区巨鹿路，每日 11:00-19:00 可自提",
        custom: "支持写字（免费）；不支持造型定制",
        storage: "冷藏取出回温 5-10 分钟，24 小时内食用最佳",
      },
      ingredients: {
        labels: [
          { label: "纯动物奶油", kind: "good" },
          { label: "低糖配方", kind: "good" },
          { label: "含乳制品", kind: "note" },
        ],
        cream: "100% 动物稀奶油（乳脂≥35%）",
        sugar: "低糖（约 13°Brix）",
        additives: "仅含吉利丁（凝固剂），无防腐剂 / 人工香精",
        allergens: "含乳制品、鸡蛋、麸质",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 87 条评价",
      goodReviews: [
        "茉莉香清雅不冲，青提解腻",
        "饼皮薄而韧，一层层很分明",
        "颜值高，送人有面子",
      ],
      badReviews: [
        { text: "青提季节性偏酸", count: 2 },
        { text: "奶油层略厚", count: 2 },
      ],
    },
  },
  {
    id: "c5",
    name: "70% 黑巧海盐戚风",
    brand: "FineART",
    size: "6寸",
    addr: "浦东新区晶耀前滩",
    price: 168,
    rating: 4.1,
    reviews: 65,
    heatTag: "纯元",
    heatClass: "bg-[#4a3320] text-white",
    art: "bg-gradient-to-br from-[#e5d5c5] to-[#d1b79c]",
    silhouetteColor: "text-[#6b4a33]",
    booking: "提前1天订",
    bookingGroup: "提前1天",
    tags: [
      { label: "低糖", kind: "good" },
      { label: "含坚果", kind: "note" },
    ],
    flavors: ["巧克力浓郁", "咸甜口"],
    detail: {
      sizePeople: "6寸（2-4人）",
      addr: "浦东新区晶耀前滩",
      sold: "已售 400+",
      wants: 97,
      profile:
        "70% 黑巧的醇苦被海盐轻轻托起，甜度压到最低——一口苦甜分明、懂巧克力的戚风。",
      overall: { score: 4.1, overPercent: 76, taste: 4.0, ingredient: 4.1, value: 4.0 },
      dims: [
        { name: "甜度", score: 2.2, desc: "海盐压甜，苦甜平衡" },
        { name: "风味", score: 3.9, desc: "黑巧醇苦带焦香，记忆点强" },
        { name: "口感", score: 3.8, desc: "戚风松软但略扎实" },
        { name: "湿润度", score: 3.6, desc: "中间层湿润，边缘偏干" },
        { name: "浓郁度", score: 4.2, desc: "70% 黑巧浓郁度高" },
        { name: "奶油占比", score: 2.6, desc: "奶油克制，巧克力为主角" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "黑巧的焦香可可 · 海盐的矿物咸香",
          summary: "醇厚、微咸，第一印象是“苦”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "70% 黑巧的醇苦回甘 · 奶油的柔润",
          summary: "苦甜交织、层次分明",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "可可的悠长残韵 · 海盐的微咸回口",
          summary: "持久、深沉，焦香是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 黑巧淋面",
          taste: "黑巧醇苦微甜",
          mouthfeel: "脆感融化，浓而不腻",
        },
        {
          name: "中层 · 奶油夹心",
          taste: "奶香微咸",
          mouthfeel: "绵密顺滑",
        },
        {
          name: "底层 · 戚风胚",
          taste: "麦香蛋香",
          mouthfeel: "松软，边缘略扎实",
        },
      ],
      purchase: {
        channel: "FineART 微信小程序",
        cycle: "提前 1 天预订，当日 18:00 截单",
        address: "浦东新区晶耀前滩，每日 11:00-19:00 可自提",
        custom: "可换夹心（+¥20）；不支持造型定制",
        storage: "冷藏保存，24 小时内食用最佳",
      },
      ingredients: {
        labels: [
          { label: "低糖配方", kind: "good" },
          { label: "无防腐剂", kind: "good" },
          { label: "含坚果", kind: "note" },
        ],
        cream: "动物稀奶油（乳脂≥35%）",
        sugar: "低糖（约 12°Brix）",
        additives: "无防腐剂、无人工香精",
        allergens: "含乳制品、鸡蛋、麸质、坚果（榛子碎）",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 65 条评价",
      goodReviews: [
        "黑巧苦度正，海盐提味很妙",
        "甜度低，怕腻的人友好",
        "巧克力和戚风的组合不常见",
      ],
      badReviews: [
        { text: "边缘戚风偏干", count: 3 },
        { text: "坚果碎分布不均", count: 2 },
      ],
    },
  },
  {
    id: "c6",
    name: "柚子糯米胚蛋糕",
    brand: "ITA Cake",
    size: "6寸",
    addr: "长宁区愚园路",
    price: 268,
    rating: 4.6,
    reviews: 156,
    heatTag: "顶流",
    heatClass: "bg-rose text-white",
    art: "bg-gradient-to-br from-[#f3efdf] to-[#e6dcae]",
    silhouetteColor: "text-[#8f9659]",
    booking: "提前3天以上订",
    bookingGroup: "提前3天以上",
    tags: [
      { label: "纯动物奶油", kind: "good" },
      { label: "低糖", kind: "good" },
      { label: "糯米胚", kind: "plain" },
    ],
    flavors: ["酸甜果味"],
    detail: {
      sizePeople: "6寸（2-4人）",
      addr: "线上小程序预约，无线下门店",
      sold: "已售 2k+",
      wants: 506,
      profile:
        "柚子的清苦果香撞上糯米的谷香 Q 弹，甜度极低——一口东方风韵、越嚼越有味的蛋糕。",
      overall: { score: 4.6, overPercent: 95, taste: 4.5, ingredient: 4.7, value: 4.3 },
      dims: [
        { name: "甜度", score: 2.4, desc: "柚子微苦微酸，甜度低" },
        { name: "风味", score: 4.5, desc: "柚子果香 + 糯米谷香，东方食材层次丰富" },
        { name: "口感", score: 4.3, desc: "糯米胚 Q 弹有嚼劲，越嚼越香" },
        { name: "湿润度", score: 4.1, desc: "果肉汁水足，胚体糯而不干" },
        { name: "浓郁度", score: 3.8, desc: "柚子香清晰，不闷" },
        { name: "奶油占比", score: 2.7, desc: "奶油轻薄，突出胚体口感" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "柚子的清香果酸 · 柚子皮的精油芳香",
          summary: "清新、明亮，第一印象是“柚子”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "柚子果肉的多汁酸甜 · 动物奶油的奶香 · 糯米的谷物香",
          summary: "复杂、平衡，果香谷香交织",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "柚子皮的微苦残留 · 奶油的乳脂余韵",
          summary: "持久、清新，柚子回甘是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 奶油与柚子果肉",
          taste: "柚子酸甜微苦",
          mouthfeel: "奶油轻薄，果肉多汁",
        },
        {
          name: "中层 · 糯米胚",
          taste: "谷物甜香",
          mouthfeel: "Q 弹有嚼劲，越嚼越香",
        },
        {
          name: "底层 · 柚子酱层",
          taste: "柚子酱的微苦甘甜",
          mouthfeel: "湿润服帖",
        },
      ],
      purchase: {
        channel: "ITA Cake 官方微信客服预约",
        cycle: "提前 3 天以上预订；每天 0:00 小程序放号",
        address: "无线下门店，仅冷链配送（配送费 ¥15）",
        custom: "不支持定制",
        storage: "冷藏保存，24 小时内食用最佳",
      },
      ingredients: {
        labels: [
          { label: "纯动物奶油", kind: "good" },
          { label: "低糖配方", kind: "good" },
          { label: "糯米胚", kind: "plain" },
        ],
        cream: "动物稀奶油（乳脂≥35%）",
        sugar: "低糖（约 12°Brix）",
        additives: "无防腐剂、无人工香精 / 色素",
        allergens: "含乳制品、鸡蛋、糯米（麸质）",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 156 条评价",
      goodReviews: [
        "糯米胚糯韧有嚼劲，和戚风完全不同",
        "柚子清香，低甜不齁",
        "东方食材搭配很特别，层次多",
      ],
      badReviews: [
        { text: "0 点放号太卷，经常秒没", count: 18 },
        { text: "无门店只能等配送", count: 6 },
      ],
    },
  },
  {
    id: "c7",
    name: "泰奶茶达克瓦兹",
    brand: "POURNIL",
    size: "4寸",
    addr: "黄浦区茂名南路",
    price: 128,
    rating: 4.0,
    reviews: 54,
    heatTag: "热门",
    heatClass: "bg-accent text-white",
    art: "bg-gradient-to-br from-[#f4e8d8] to-[#e8cfa8]",
    silhouetteColor: "text-[#a3805a]",
    booking: "提前1天订",
    bookingGroup: "提前1天",
    tags: [
      { label: "无防腐剂", kind: "good" },
      { label: "含酒精", kind: "note" },
    ],
    flavors: ["奶茶风味"],
    detail: {
      sizePeople: "4寸（1-2人）",
      addr: "黄浦区茂名南路",
      sold: "已售 300+",
      wants: 76,
      profile:
        "泰茶的香料感被炼乳揉得圆圆的，外壳脆、内里润——一口浓郁温柔、异域感十足的小点心。",
      overall: { score: 4.0, overPercent: 71, taste: 4.0, ingredient: 3.9, value: 3.8 },
      dims: [
        { name: "甜度", score: 3.0, desc: "泰奶甜香明显，中等偏甜" },
        { name: "风味", score: 3.8, desc: "泰茶香浓，外脆内软" },
        { name: "口感", score: 3.9, desc: "外壳酥脆，内里湿润" },
        { name: "湿润度", score: 3.3, desc: "夹心滋润，外壳易受潮" },
        { name: "浓郁度", score: 4.0, desc: "泰茶 + 炼乳双香" },
        { name: "奶油占比", score: 2.4, desc: "夹心适量，不厚重" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "泰茶的香料气息 · 烘烤杏仁的坚果香",
          summary: "浓郁、温暖，第一印象是“泰茶”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "泰茶卡仕达的甜润 · 炼乳的奶甜",
          summary: "甜香饱满、层层化开",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "泰茶的微苦回口 · 奶甜的余韵",
          summary: "持久、甜蜜，茶香是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "外壳 · 达克瓦兹皮",
          taste: "烤杏仁香",
          mouthfeel: "酥脆，轻压回弹",
        },
        {
          name: "夹心 · 泰茶卡仕达",
          taste: "泰茶微苦 + 炼乳甜润",
          mouthfeel: "顺滑细腻",
        },
      ],
      purchase: {
        channel: "POURNIL 微信小程序",
        cycle: "提前 1 天预订，当日 18:00 截单",
        address: "黄浦区茂名南路，每日 11:00-19:00 可自提",
        custom: "不支持定制",
        storage: "当日食用最佳，外壳口感最酥",
      },
      ingredients: {
        labels: [
          { label: "无防腐剂", kind: "good" },
          { label: "含酒精", kind: "note" },
          { label: "含坚果", kind: "note" },
        ],
        cream: "动物稀奶油 + 泰茶卡仕达",
        sugar: "正常（约 15°Brix）",
        additives: "含少量朗姆酒（调味），无防腐剂",
        allergens: "含乳制品、鸡蛋、麸质、坚果（杏仁粉）",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 54 条评价",
      goodReviews: [
        "泰茶味很正，外壳酥脆",
        "一口一个的大小很方便",
        "卡仕达顺滑，不甜腻",
      ],
      badReviews: [
        { text: "放久外壳回软", count: 4 },
        { text: "甜度偏高", count: 3 },
      ],
    },
  },
  {
    id: "c8",
    name: "重芝士巴斯克",
    brand: "Haku",
    size: "5寸",
    addr: "静安区巨鹿路",
    price: 158,
    rating: 4.3,
    reviews: 98,
    heatTag: "热门",
    heatClass: "bg-accent text-white",
    art: "bg-gradient-to-br from-[#efe3d2] to-[#dcc2a4]",
    silhouetteColor: "text-[#8a6a48]",
    booking: "提前1天订",
    bookingGroup: "提前1天",
    tags: [
      { label: "低糖", kind: "good" },
      { label: "纯动物奶油", kind: "good" },
    ],
    flavors: ["芝士咸香"],
    detail: {
      sizePeople: "5寸（2-3人）",
      addr: "静安区巨鹿路",
      sold: "已售 700+",
      wants: 143,
      profile:
        "焦香表皮裹着半熟流心，芝士的浓和乳脂的润不分彼此——一口厚重满足、芝士控的本命。",
      overall: { score: 4.3, overPercent: 85, taste: 4.3, ingredient: 4.4, value: 4.1 },
      dims: [
        { name: "甜度", score: 2.7, desc: "乳脂甜香为主，糖度克制" },
        { name: "风味", score: 4.0, desc: "芝士香纯正，焦香表皮加分" },
        { name: "口感", score: 4.3, desc: "外焦里嫩，中心半熟流心" },
        { name: "湿润度", score: 3.4, desc: "中心湿润，边缘扎实" },
        { name: "浓郁度", score: 4.4, desc: "重芝士浓郁度拉满" },
        { name: "奶油占比", score: 3.6, desc: "芝士即主体，厚重感强" },
      ],
      aroma: [
        {
          stage: "前调 · 入口瞬间",
          timing: "0-3 秒",
          desc: "高温焦化的焦糖香 · 奶油芝士的酵香",
          summary: "浓烈、焦香，第一印象是“烤”",
          tone: "green",
        },
        {
          stage: "中调 · 咀嚼时",
          timing: "3-10 秒",
          desc: "重芝士的咸鲜浓郁 · 乳脂的甜润",
          summary: "浓郁、绵密，咸甜交融",
          tone: "yellow",
        },
        {
          stage: "后调 · 咽下余韵",
          timing: "10 秒+",
          desc: "芝士的悠长咸鲜 · 焦糖的微苦尾韵",
          summary: "持久、厚重，乳脂香是记忆点",
          tone: "purple",
        },
      ],
      textureLayers: [
        {
          name: "表层 · 焦香表皮",
          taste: "焦糖微苦",
          mouthfeel: "微脆焦香",
        },
        {
          name: "中心 · 半熟流心",
          taste: "芝士咸香浓郁",
          mouthfeel: "半熟流心，绵密如酱",
        },
        {
          name: "边缘 · 全熟层",
          taste: "芝士醇厚",
          mouthfeel: "扎实绵密",
        },
      ],
      purchase: {
        channel: "Haku 微信小程序",
        cycle: "提前 1 天预订，当日 16:00 截单",
        address: "静安区巨鹿路，每日 11:00-19:00 可自提",
        custom: "不支持定制",
        storage: "冷藏取出回温 10 分钟风味最佳，48 小时内食用",
      },
      ingredients: {
        labels: [
          { label: "低糖配方", kind: "good" },
          { label: "纯动物奶油", kind: "good" },
        ],
        cream: "奶油芝士（乳脂≥33%）+ 动物稀奶油",
        sugar: "低糖（约 13°Brix）",
        additives: "无防腐剂、无人工香精",
        allergens: "含乳制品、鸡蛋",
        source: "官方配料表 + 糕研所实验室复检",
      },
      source: "小红书 / 大众点评 · 98 条评价",
      goodReviews: [
        "焦香表皮太香了",
        "半熟流心，芝士味浓",
        "低糖版本吃不出负担",
      ],
      badReviews: [
        { text: "芝士厚重，一人吃不完", count: 5 },
        { text: "回温时间没掌握好会偏腻", count: 3 },
      ],
    },
  },
];
