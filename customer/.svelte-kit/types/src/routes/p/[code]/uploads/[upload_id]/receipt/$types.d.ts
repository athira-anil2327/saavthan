import type * as Kit from '@sveltejs/kit';
import { MatcherParam } from '@sveltejs/kit/params';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type RouteParams = { code: string; upload_id: string };
type RouteId = '/p/[code]/uploads/[upload_id]/receipt';

export type EntryGenerator = () => Promise<Array<RouteParams>> | Array<RouteParams>;
export type RequestHandler = Kit.RequestHandler<RouteParams, RouteId>;
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;