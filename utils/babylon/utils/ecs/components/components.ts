/* eslint-disable @typescript-eslint/no-unused-vars */
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';
import _Monster from './monster/monster';

@component export class UID {
	@field.int32 declare value: number;
}
@component export class Global {
	@field.uint8 declare value: number;
}
export const Monster = _Monster;
