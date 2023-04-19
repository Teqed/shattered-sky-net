/* eslint-disable @typescript-eslint/no-unused-vars */
import { component, field, system, System, World, type Entity } from '@lastolivegames/becsy';
import _Monster from './monster/monster';
import _Narrator from './narrator/narrator';

@component export class UID {
	@field.int32 declare value: number;
}
export const Monster = _Monster;
export const Narrator = _Narrator;
