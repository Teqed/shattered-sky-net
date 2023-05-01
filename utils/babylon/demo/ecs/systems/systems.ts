import CombatPositionSystem from './CombatPosition';
import InputSystem from './Input';
import MeshPositionSystem from './MeshPosition';
import EnergySystem from './narrator/combat/Energy';
import GameStateSystem from './narrator/GameState';
import UIDSystem from './UID';

const systems = {
	CombatPositionSystem,
	EnergySystem,
	GameStateSystem,
	InputSystem,
	MeshPositionSystem,
	UIDSystem,
};

export default systems;
