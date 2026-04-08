export const SITE = {
  website: "https://your-blog-domain.com/", // replace this with your deployed domain
  author: "雨天的烟花",
  profile: "https://github.com/whisper-you",
  desc: "一个用于学习记录和知识分享的个人博客",
  title: "雨天的烟花",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4, // 每页显示更多文章，方便浏览
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "编辑文章",
    url: "https://github.com/whisper-you/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // html lang code. 设置为中文
  timezone: "Asia/Shanghai", // 使用中国时区
} as const;