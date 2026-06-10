export type ProjectType = "residential" | "commercial";

export interface Project {
  slug: string;
  folder: string;
  title: string;
  titleEn: string;
  city: string;
  area: string;
  year: string;
  category: string;
  type: ProjectType;
  cover: string;
  description: string;
  descriptionEn: string;
  galleryOrder?: number[];
}

export const projects: Project[] = [
  // ====== 住宅 ======
  { slug: "baimahuayuan", folder: "baimahuayuan", title: "白马花园", titleEn: "White Horse Garden", city: "南京", area: "260㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/baimahuayuan/DSF4433_副本.jpg", description: "大平层住宅的开放与私密平衡。通过灵活隔断与材质过渡，在开阔的公区与静谧的私区之间建立自然流转。", descriptionEn: "Balancing openness and privacy in a large flat. Flexible partitions and material transitions create a natural flow between expansive common areas and tranquil private quarters." },
  { slug: "baolizijing", folder: "baolizijing", title: "保利紫荆公馆", titleEn: "Poly Bauhinia Residence", city: "南京", area: "189㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/baolizijing/DSF2755_副本.jpg", description: "精装改造项目，在保留原始结构的基础上，通过软装与材质重塑空间气质，赋予理性秩序以温润质感。", descriptionEn: "A renovation project that reshapes spatial character through furnishings and materials while preserving the original structure, bringing warmth to rational order." },
  { slug: "binjiangxi", folder: "binjiangxi", title: "滨江玺", titleEn: "Riverside Seal", city: "南通", area: "220㎡", year: "2025", category: "住宅", type: "residential", cover: "/projects/binjiangxi/DSF1955.jpg", description: "滨江而居，引景入室。大面积落地窗将江景纳入日常，空间以克制的手法回应自然的辽阔。", descriptionEn: "Riverside living where the landscape enters the interior. Floor-to-ceiling windows frame the river as a daily backdrop, while the space responds to nature with restrained elegance." },
  { slug: "daomengkongjian", folder: "daomengkongjian", title: "盗梦空间", titleEn: "Inception", city: "南京", area: "180㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/daomengkongjian/DSF5209.jpg", description: "以梦境叙事为灵感，模糊现实与想象的边界。通过镜面、光影与通透隔断，创造层层递进的空间体验。", descriptionEn: "Inspired by dream narratives, blurring the boundary between reality and imagination. Mirrors, light, and transparent partitions create a layered spatial experience." },
  { slug: "guyuelanyuan", folder: "guyuelanyuan", title: "鼓悦兰园", titleEn: "Guyue Orchid Garden", city: "南京", area: "200㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/guyuelanyuan/DSF2325.jpg", description: "以当代手法演绎东方居住美学。木质与石材的交织，在简洁的几何秩序中流露内敛的雅致。", descriptionEn: "A contemporary take on Eastern residential aesthetics. The interplay of wood and stone reveals understated elegance within clean geometric order." },
  { slug: "office", folder: "office", title: "ADDA 办公室", titleEn: "ADDA Office", city: "南京", area: "350㎡", year: "2025", category: "办公空间", type: "commercial", cover: "/projects/office/IMG_3271.jpg", description: "邸岸空间建筑设计事务所自用办公空间。以「思考之物」为主题，将工作、展示、交流融为一体。", descriptionEn: "ADDA architecture's own office. Under the theme of 'Thinking Things', it integrates work, exhibition, and communication into one space." },
  { slug: "ruian", folder: "ruian", title: "瑞安", titleEn: "Ruian Residence", city: "瑞安", area: "160㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/ruian/DSF7852.jpg", description: "中小户型的精细化设计实践。每一寸空间都被重新审视，在紧凑中寻求从容的生活尺度。", descriptionEn: "A meticulous design practice for compact living. Every inch is reconsidered to find a comfortable scale of life within a limited footprint." },
  { slug: "tianhongshanzhuang", folder: "tianhongshanzhuang", title: "天泓山庄", titleEn: "Tianhong Villa", city: "南京", area: "280㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/tianhongshanzhuang/IMG_2211 2.jpg", description: "别墅空间的纵向叙事。分层规划功能与氛围，楼梯成为串联不同生活场景的垂直纽带。", descriptionEn: "A vertical narrative across villa levels. Each floor is planned for distinct function and atmosphere, with the staircase serving as the vertical thread connecting different life scenes." },
  { slug: "yunqimeiguiyuan", folder: "yunqimeiguiyuan", title: "云栖玫瑰园", titleEn: "Cloud Rose Garden", city: "南京", area: "240㎡", year: "2024", category: "住宅", type: "residential", cover: "/projects/yunqimeiguiyuan/IMG_3347.jpg", description: "光线为空间叙事的线索，材质则是光的载体。微水泥的哑光肌理与镜面的反射延伸，共同谱写静谧而有层次的生活场域。", descriptionEn: "Light leads the spatial narrative while materials carry it. Matte micro-cement textures and mirrored reflections compose a serene, layered living environment." },

  // ====== 商业 ======
  { slug: "33coffee", folder: "33coffee", title: "33 Coffee", titleEn: "33 Coffee", city: "南京", area: "120㎡", year: "2024", category: "商业", type: "commercial", cover: "/projects/33coffee/DSF5046.jpg", description: "街角咖啡店的空间诗意。以温暖的木质与斑驳光影，在城市缝隙中营造一处慢下来的角落。", descriptionEn: "The spatial poetry of a corner cafe. Warm wood and dappled light create a slow corner in the gaps of the city." },
  { slug: "shuangxijia", folder: "shuangxijia", title: "霜禧家", titleEn: "Shuangxi Home", city: "南京", area: "150㎡", year: "2024", category: "商业", type: "commercial", cover: "/projects/shuangxijia/SCF5169.jpg", description: "甜品与空间的甜蜜共鸣。柔和弧线与奶油色调构成空间的底色，让每一口甜都有恰到好处的氛围。", descriptionEn: "A sweet resonance between dessert and space. Soft curves and creamy tones form the backdrop, giving every bite its perfect atmosphere." },
  { slug: "myhair", folder: "myhair", title: "北京 MYHAIR 理发店", titleEn: "MYHAIR Beijing", city: "北京", area: "200㎡", year: "2025", category: "商业", type: "commercial", cover: "/projects/myhair/DSF5551.jpg", description: "理发店作为自我重塑的仪式场所。金属与镜面的冷静对话，在工业感中注入精致的服务体验。", descriptionEn: "A barbershop as a ritual space for self-reinvention. A cool dialogue between metal and mirror, infusing an industrial feel with refined service experience." },
  { slug: "linshenjianlu", folder: "linshenjianlu", title: "林深见鹿", titleEn: "Deer in the Woods", city: "南京", area: "180㎡", year: "2024", category: "商业", type: "commercial", cover: "/projects/linshenjianlu/DSF1115.jpg", description: "以诗意为名的餐饮空间。将「林深见鹿」的东方意境转化为空间语言，在都市中辟出一方隐逸之所。", descriptionEn: "A dining space named after poetry. Translating the Eastern意境 of 'seeing a deer deep in the woods' into spatial language, carving out a hidden retreat in the city." },
  { slug: "xileyishu", folder: "xileyishu", title: "喜乐艺术 2.0", titleEn: "Joy Art 2.0", city: "南京", area: "300㎡", year: "2025", category: "商业", type: "commercial", cover: "/projects/xileyishu/DSF3007.jpg", description: "艺术培训空间的迭代升级。以开放灵活的布局回应多元教学需求，让创造力在流动的空间中自由生长。", descriptionEn: "An iterative upgrade of an art education space. An open, flexible layout responds to diverse teaching needs, letting creativity flourish in a fluid environment." },
  { slug: "yishaolingshi", folder: "yishaolingshi", title: "一勺轻食", titleEn: "A Spoon of Light", city: "南京", area: "80㎡", year: "2024", category: "商业", type: "commercial", cover: "/projects/yishaolingshi/3df54426898ea4979c8f4e8f81d8d87.jpg", description: "轻食空间的极简表达。以小见大，在有限面积中通过精准的材质选择与光线控制，传递轻盈健康的生活理念。", descriptionEn: "A minimalist expression of a light-food space. Doing more with less, precise material choices and light control convey an airy, healthy lifestyle within a compact footprint." },
];
