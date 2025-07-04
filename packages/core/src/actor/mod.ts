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

// Compatibility layer - overloaded actor function

/**
 * Creates an actor with type-safe events using a single generic interface.
 * 
 * @example
 * ```typescript
 * const counter = actor<{
 *   events: { newCount: [number]; reset: [] };
 *   state: { count: number };
 * }>({
 *   state: { count: 0 },
 *   actions: {
 *     increment: (c, x: number) => {
 *       c.state.count += x;
 *       c.broadcast("newCount", c.state.count); // ✅ Type-safe!
 *       return c.state.count;
 *     },
 *   },
 * });
 * ```
 */
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
	>,
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
>;

/**
 * Creates an actor with legacy API support (backward compatibility).
 * Events will not be type-safe with this usage pattern.
 * 
 * @example
 * ```typescript
 * const counter = actor({
 *   state: { count: 0 },
 *   actions: {
 *     increment: (c, x: number) => {
 *       c.state.count += x;
 *       c.broadcast("newCount", c.state.count); // Works but not type-safe
 *       return c.state.count;
 *     },
 *   },
 * });
 * ```
 */
export function actor<R extends Actions<any, any, any, any, any, any, any, Record<string, any[]>>>(
	input: ActorConfigInput<any, any, any, any, any, any, any, Record<string, any[]>, R>,
): ActorDefinition<any, any, any, any, any, any, any, Record<string, any[]>, R>;

// Implementation
export function actor<T extends ActorConfigInterface | undefined = undefined>(
	input: any,
): any {
	// For legacy usage (no generics), use internal function with any types
	return _actor<any, any, any, any, any, any, any, Record<string, any[]>, any>(input);
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
