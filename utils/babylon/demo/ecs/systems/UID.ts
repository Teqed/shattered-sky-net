/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable canonical/filename-match-regex */
import { defineSystem, Entity, initStruct, struct } from 'thyseus';

@struct
class UID {
	@struct.u32 declare id: number;

	constructor(id: number = 0) {
		initStruct(this);

		this.id = id;
	}
}

// eslint-disable-next-line import/prefer-default-export
export const uidSystem = defineSystem(
	({ Query, Without }) => [Query([Entity], Without(UID))],
	// eslint-disable-next-line func-names
	function uidSystem(query) {
		query.forEach(entity => {
			entity.add(new UID(Math.random() * 1_000_000));
		});
	},
);
