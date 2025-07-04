import {
	type Actions,
	type ActorConfig,
	type ActorConfigInput,
	ActorConfigSchema,
	type ActorConfigInterface,
	type ExtractState,
	type ExtractEvents,
	type ExtractConnectionParams,
	type ExtractConnectionState,
	type ExtractVariables,
	type ExtractInput,
	type ExtractAuthData,
	type ExtractDatabase,
} from "./config";
import { ActorDefinition } from "./definition";

// Internal 8-generic actor function
export function _actor<
	S,
	CP,
	CS,
	V,
	I,
	AD,
	DB,
	E,
	R extends Actions<S, CP, CS, V, I, AD, DB, E>,
>(
	input: ActorConfigInput<S, CP, CS, V, I, AD, DB, E, R>,
): ActorDefinition<S, CP, CS, V, I, AD, DB, E, R> {
	const config = ActorConfigSchema.parse(input) as ActorConfig<
		S,
		CP,
		CS,
		V,
		I,
		AD,
		DB,
		E
	>;
	return new ActorDefinition(config);
}

// New single-generic public actor function
export function actor<T extends ActorConfigInterface>(
	input: ActorConfigInput<
		ExtractState<T>,
		ExtractConnectionParams<T>,
		ExtractConnectionState<T>,
		ExtractVariables<T>,
		ExtractInput<T>,
		ExtractAuthData<T>,
		ExtractDatabase<T>,
		ExtractEvents<T>,
		Actions<
			ExtractState<T>,
			ExtractConnectionParams<T>,
			ExtractConnectionState<T>,
			ExtractVariables<T>,
			ExtractInput<T>,
			ExtractAuthData<T>,
			ExtractDatabase<T>,
			ExtractEvents<T>
		>
	>
): ActorDefinition<
	ExtractState<T>,
	ExtractConnectionParams<T>,
	ExtractConnectionState<T>,
	ExtractVariables<T>,
	ExtractInput<T>,
	ExtractAuthData<T>,
	ExtractDatabase<T>,
	ExtractEvents<T>,
	Actions<
		ExtractState<T>,
		ExtractConnectionParams<T>,
		ExtractConnectionState<T>,
		ExtractVariables<T>,
		ExtractInput<T>,
		ExtractAuthData<T>,
		ExtractDatabase<T>,
		ExtractEvents<T>
	>
> {
	return _actor(input);
}

export type { ActorKey } from "@/manager/protocol/query";
export type { ActorContext } from "./context";
export { UserError, type UserErrorOptions } from "./errors";
export type { Conn } from "./connection";
export type { ActionContext } from "./action";
export type * from "./config";
export type { Encoding } from "@/actor/protocol/serde";
export type {
	ActorDefinition,
	AnyActorDefinition,
	ActorContextOf,
	ActionContextOf,
} from "./definition";
export { ALLOWED_PUBLIC_HEADERS } from "./router-endpoints";
