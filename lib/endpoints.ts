export type FieldType = "text" | "select" | "number" | "date";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string;
};

export type Endpoint = {
  id: string;
  label: string;
  method: "GET";
  /** 接口路径模板，例如 /v1/characters 或 /v1/characters/:id */
  pathTemplate: string;
  /** path 中的占位符，例如 :id */
  pathParams?: Field[];
  /** query 参数 */
  queryParams?: Field[];
  /** 简短描述 */
  description: string;
  /** 渲染结果时使用的卡片样式 */
  resultKind: "characters" | "character" | "events" | "event" | "music" | "musicItem" | "card" | "raw";
};

export const SERIES_OPTIONS = [
  { label: "（不限）", value: "" },
  { label: "μ's", value: "μ's" },
  { label: "Aqours", value: "Aqours" },
  { label: "虹ヶ咲", value: "虹ヶ咲" },
  { label: "Liella!", value: "Liella!" },
  { label: "蓮ノ空", value: "蓮ノ空" },
  { label: "莲之空女学院学园偶像俱乐部", value: "莲之空女学院学园偶像俱乐部" },
];

const TIMEZONE_OPTIONS = [
  { label: "Asia/Shanghai (默认)", value: "Asia/Shanghai" },
  { label: "Asia/Tokyo", value: "Asia/Tokyo" },
  { label: "Asia/Hong_Kong", value: "Asia/Hong_Kong" },
  { label: "America/Los_Angeles", value: "America/Los_Angeles" },
  { label: "Europe/London", value: "Europe/London" },
  { label: "UTC", value: "UTC" },
];

const MONTH_OPTIONS = [
  { label: "（不限）", value: "" },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} 月`,
    value: String(i + 1),
  })),
];

const EVENT_CATEGORY_OPTIONS = [
  { label: "（不限）", value: "" },
  { label: "live", value: "live" },
  { label: "stream", value: "stream" },
  { label: "event", value: "event" },
];

const EVENT_SOURCE_OPTIONS = [
  { label: "（不限）", value: "" },
  { label: "official-schedule", value: "official-schedule" },
  { label: "official-news", value: "official-news" },
  { label: "rsshub", value: "rsshub" },
  { label: "llch-timeline", value: "llch-timeline" },
  { label: "llch-cvtochina", value: "llch-cvtochina" },
];

const MUSIC_SOURCE_OPTIONS = [
  { label: "（不限）", value: "" },
  { label: "official-otonokizaka-music (μ's)", value: "official-otonokizaka-music" },
  { label: "official-uranohoshi-music (Aqours)", value: "official-uranohoshi-music" },
  { label: "official-nijigasaki-music (虹咲)", value: "official-nijigasaki-music" },
  { label: "official-yuigaoka-music (Liella!)", value: "official-yuigaoka-music" },
  { label: "official-hasunosora-music (蓮ノ空)", value: "official-hasunosora-music" },
];

const CARD_GAME_OPTIONS = [
  { label: "sif", value: "sif" },
  { label: "sif2", value: "sif2" },
];

const CARD_RARITY_OPTIONS = [
  { label: "（不限）", value: "" },
  { label: "R", value: "R" },
  { label: "SR", value: "SR" },
  { label: "UR", value: "UR" },
];

export const ENDPOINTS: Endpoint[] = [
  {
    id: "characters-list",
    label: "角色列表",
    method: "GET",
    pathTemplate: "/v1/characters",
    description: "查询全部角色，支持按团体、关键字、生日月份过滤。",
    resultKind: "characters",
    queryParams: [
      {
        name: "q",
        label: "关键字",
        placeholder: "例如：香音 / maki / 澁谷",
        hint: "按中日英名、别名、id 模糊匹配",
      },
      { name: "group", label: "团体", type: "select", options: SERIES_OPTIONS },
      { name: "birthdayMonth", label: "生日月份", type: "select", options: MONTH_OPTIONS },
    ],
  },
  {
    id: "characters-detail",
    label: "角色详情",
    method: "GET",
    pathTemplate: "/v1/characters/:id",
    description: "用稳定 id 取单个角色，例如 kanon-shibuya。",
    resultKind: "character",
    pathParams: [
      {
        name: "id",
        label: "角色 id",
        placeholder: "kanon-shibuya",
        required: true,
        defaultValue: "kanon-shibuya",
      },
    ],
  },
  {
    id: "birthdays-today",
    label: "今日生日",
    method: "GET",
    pathTemplate: "/v1/birthdays/today",
    description: "查询指定时区当天过生日的角色。",
    resultKind: "characters",
    queryParams: [
      {
        name: "tz",
        label: "时区",
        type: "select",
        options: TIMEZONE_OPTIONS,
        defaultValue: "Asia/Shanghai",
      },
    ],
  },
  {
    id: "events-list",
    label: "活动列表",
    method: "GET",
    pathTemplate: "/v1/events",
    description: "聚合官方日程、新闻、LL-CH 时间线等数据源。",
    resultKind: "events",
    queryParams: [
      { name: "from", label: "起始日期", type: "date", placeholder: "YYYY-MM-DD" },
      { name: "to", label: "结束日期", type: "date", placeholder: "YYYY-MM-DD" },
      { name: "series", label: "企划/团体", type: "select", options: SERIES_OPTIONS },
      { name: "category", label: "活动类型", type: "select", options: EVENT_CATEGORY_OPTIONS },
      { name: "source", label: "数据来源", type: "select", options: EVENT_SOURCE_OPTIONS },
    ],
  },
  {
    id: "events-detail",
    label: "活动详情",
    method: "GET",
    pathTemplate: "/v1/events/:id",
    description: "用 id 取单个活动详情。",
    resultKind: "event",
    pathParams: [
      {
        name: "id",
        label: "活动 id",
        placeholder: "可先用 “活动列表” 获取",
        required: true,
      },
    ],
  },
  {
    id: "music-list",
    label: "歌曲列表",
    method: "GET",
    pathTemplate: "/v1/music",
    description: "按歌名、专辑、演唱者、发售日筛选官方歌曲。",
    resultKind: "music",
    queryParams: [
      {
        name: "q",
        label: "歌名/译名/演唱者",
        placeholder: "例如：愛してるばんざーい / Aspire / 爱上你万岁",
      },
      { name: "series", label: "企划/团体", type: "select", options: SERIES_OPTIONS },
      { name: "album", label: "专辑/单曲", placeholder: "可选" },
      { name: "artist", label: "演唱者", placeholder: "可选" },
      { name: "from", label: "发售起始", type: "date" },
      { name: "to", label: "发售结束", type: "date" },
      { name: "source", label: "数据来源", type: "select", options: MUSIC_SOURCE_OPTIONS },
    ],
  },
  {
    id: "music-detail",
    label: "歌曲详情",
    method: "GET",
    pathTemplate: "/v1/music/:id",
    description: "用 id 取单首歌详情。",
    resultKind: "musicItem",
    pathParams: [
      {
        name: "id",
        label: "歌曲 id",
        placeholder: "可先用 “歌曲列表” 获取",
        required: true,
      },
    ],
  },
  {
    id: "cards-random",
    label: "随机卡面",
    method: "GET",
    pathTemplate: "/v1/cards/random",
    description: "随机获取 SIF 或 SIF2 卡面；SIF 来自 School Idol Tomodachi，SIF2 来自 Idol Story。",
    resultKind: "card",
    queryParams: [
      {
        name: "game",
        label: "游戏",
        type: "select",
        options: CARD_GAME_OPTIONS,
        defaultValue: "sif",
        required: true,
      },
      { name: "character", label: "角色", placeholder: "例如：Kotori / 真姫 / Shizuku" },
      { name: "rarity", label: "稀有度", type: "select", options: CARD_RARITY_OPTIONS },
    ],
  },
];

/** 将路径模板和参数填充成最终路径，例如 /v1/characters/kanon-shibuya */
export function buildPath(endpoint: Endpoint, pathValues: Record<string, string>): string {
  let path = endpoint.pathTemplate;
  for (const f of endpoint.pathParams ?? []) {
    const v = pathValues[f.name]?.trim() ?? "";
    path = path.replace(`:${f.name}`, encodeURIComponent(v));
  }
  return path;
}

/** 将参数对象转成 query string */
export function buildQuery(endpoint: Endpoint, queryValues: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const f of endpoint.queryParams ?? []) {
    const v = queryValues[f.name]?.trim();
    if (v) params.append(f.name, v);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
