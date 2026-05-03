export type ApiMeta = Record<string, unknown>;

export type ApiOk<T> = { data: T; meta?: ApiMeta };
export type ApiErr = { error: { code: string; message: string } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export interface CharacterNames {
  zhHans?: string;
  ja?: string;
  en?: string;
  romaji?: string;
  aliases?: string[];
}

export interface CharacterBirthday {
  month?: number;
  day?: number;
  text?: string;
}

export interface CharacterColor {
  name?: string;
  originalName?: string;
  hex?: string;
}

export interface CharacterSource {
  name?: string;
  url?: string;
}

export interface Character {
  id: string;
  names: CharacterNames;
  group?: string;
  /** API 既可能返回字符串也可能返回数组 */
  series?: string | string[];
  birthday?: CharacterBirthday | string;
  color?: CharacterColor;
  /** 早期/兼容字段 */
  themeColor?: string;
  avatarUrl?: string;
  avatarIconUrl?: string;
  avatarIconFilename?: string;
  source?: string;
  sourceUrl?: string;
  sources?: CharacterSource[];
}

export interface EventItem {
  id: string;
  title: string;
  series?: string | string[];
  category?: string;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  venue?: string;
  performers?: string[];
  description?: string;
  source?: string;
  sourceUrl?: string;
}

export interface MusicItem {
  id: string;
  title: string;
  artist?: string;
  series?: string | string[];
  albumTitle?: string;
  albumType?: string;
  coverUrl?: string;
  releaseDate?: string;
  trackNumber?: number;
  source?: string;
  sourceUrl?: string;
}
