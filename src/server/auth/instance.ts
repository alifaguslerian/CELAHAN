import 'server-only';
import { betterAuth } from 'better-auth';
import { authOptions } from './options';
import { database } from '../data/pool';

let instance: ReturnType<typeof betterAuth> | undefined;
export function authentication() {
  instance ??= betterAuth(authOptions(database()));
  return instance;
}
