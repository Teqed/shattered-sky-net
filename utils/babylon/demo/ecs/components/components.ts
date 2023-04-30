/* eslint-disable id-length */
import { defineComponent, Types } from 'bitecs';

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };

const List = defineComponent({ values: [Types.f32, 3] }); // [type, length]
const Position = defineComponent(Vector3);
const Reference = defineComponent({ entity: Types.eid }); // Types.eid is used as a reference type
const Tag = defineComponent();
const UID = defineComponent({ uid: Types.f32 });
const Velocity = defineComponent(Vector3);

export { List, Position, Reference, Tag, UID, Velocity };
