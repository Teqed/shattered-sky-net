/* eslint-disable @typescript-eslint/no-unused-vars */
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';
import _Monster from './monster/monster';

@component export class UID {
	@field.int32 declare value: number;
}
@component export class Global {
	@field.uint8 declare triggerSave: number;
	@field.uint8 declare triggerLoad: number;
	// Game states:
	// 0: Title screen
	// 1: Combat
	// 2: Collection
	// 4: Cutscene
	@field.uint8 declare gameState: number;
}
export const Monster = _Monster;
