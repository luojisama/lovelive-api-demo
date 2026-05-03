export type ApiMeta = Record<string, unknown>;

export type ApiOk<T> = { data: T; meta?: ApiMeta };
export type ApiErr = { error: { code: string; message: string } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export interface CharacterNames {
  zhHans?: string;
  ja?: string;
  en?: string;
  aliases?: string[];
}

export interface Character {
  id: string;
  names: CharacterNames;
  group?: string;
  series?: string;
  birthday?: string;
  themeColor?: string;
  avatarUrl?: string;
  avatarIconUrl?: string;
  avatarIconFilename?: string;
  source?: string;
  sourceUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  series?: string;
  category?: string;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  venue?: string;
  performers?: string[];
  source?: string;
  sourceUrl?: string;
}

export interface MusicItem {
  id: string;
  title: string;
  artist?: string;
  series?: string;
  albumTitle?: string;
  albumType?: string;
  coverUrl?: string;
  releaseDate?: string;
  source?: string;
  sourceUrl?: string;
}
