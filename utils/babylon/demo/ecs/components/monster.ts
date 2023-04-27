/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { struct } from 'thyseus';

@struct
class Attack {
	@struct.u16 declare max: number;

	@struct.u16 declare current: number;
}
@struct
class CombatDisabled {}
@struct
class EnemyPosition {
	@struct.u16 declare position: number;
}
@struct
class Energy {
	@struct.u64 declare max: number;

	@struct.u64 declare current: number;
}
@struct
class FriendlyPosition {
	@struct.u16 declare position: number;
}
@struct
class Health {
	@struct.u16 declare max: number;

	@struct.u16 declare current: number;

	heal(amount: number) {
		// Clamp to max!
		this.current = Math.min(this.max, this.current + amount);
	}

	takeDamage(amount: number): boolean {
		// Clamp to 0 to prevent integer underflow
		this.current = Math.max(0, this.current - amount);
		// Return boolean indicating if this died!
		return this.current === 0;
	}
}
@struct
class IsCollection {}
@struct
class IsCombat {}
@struct
class IsParty {}
@struct
class IsWild {}
@struct
class Position {
	@struct.u32 declare x: number;

	@struct.u32 declare y: number;

	// eslint-disable-next-line id-length
	@struct.u32 declare z: number;
}
@struct
class QueuedAction {
	@struct.u32 declare action: number;

	@struct.u32 declare target: number;
}
@struct
class Speed {
	@struct.u16 declare max: number;

	@struct.u16 declare current: number;
}
@struct
class Team {
	@struct.u8 declare team: number;
}

export default {
	Attack,
	CombatDisabled,
	EnemyPosition,
	Energy,
	FriendlyPosition,
	Health,
	IsCollection,
	IsCombat,
	IsParty,
	IsWild,
	Position,
	QueuedAction,
	Speed,
	Team,
};
