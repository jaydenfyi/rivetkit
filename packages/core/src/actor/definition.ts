import type { ActionContext } from "./action";
import type { Actions, ActorConfig } from "./config";
import type { ActorContext } from "./context";
import { ActorInstance } from "./instance";

export type AnyActorDefinition = ActorDefinition<
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any,
	any
>;

/**
 * Extracts the context type from an ActorDefinition
 */
export type ActorContextOf<AD extends AnyActorDefinition> =
	AD extends ActorDefinition<
		infer S,
		infer CP,
		infer CS,
		infer V,
		infer I,
		infer AD,
		infer DB,
		infer E,
		any
	>
		? ActorContext<S, CP, CS, V, I, AD, DB, E>
		: never;

/**
 * Extracts the context type from an ActorDefinition
 */
export type ActionContextOf<AD extends AnyActorDefinition> =
	AD extends ActorDefinition<
		infer S,
		infer CP,
		infer CS,
		infer V,
		infer I,
		infer AD,
		infer DB,
		infer E,
		any
	>
		? ActionContext<S, CP, CS, V, I, AD, DB, E>
		: never;

export class ActorDefinition<
	S,
	CP,
	CS,
	V,
	I,
	AD,
	DB,
	E,
	R extends Actions<S, CP, CS, V, I, AD, DB, E>,
> {
	#config: ActorConfig<S, CP, CS, V, I, AD, DB, E>;

	constructor(config: ActorConfig<S, CP, CS, V, I, AD, DB, E>) {
		this.#config = config;
	}

	get config(): ActorConfig<S, CP, CS, V, I, AD, DB, E> {
		return this.#config;
	}

	instantiate(): ActorInstance<S, CP, CS, V, I, AD, DB, E> {
		return new ActorInstance(this.#config);
	}
}
