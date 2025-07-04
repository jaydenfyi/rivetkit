// Requires Svelte 5 and runes enabled
import {
  type AnyActorRegistry,
  type CreateRivetKitOptions,
  type ActorOptions,
  createRivetKit as createVanillaRivetKit,
} from "@rivetkit/framework-base";
import type { Client, ExtractActorsFromRegistry } from "@rivetkit/core/client";
import { createClient } from "@rivetkit/core/client";
import { Registry } from "@rivetkit/core";

export { createClient } from "@rivetkit/core/client";

/**
 * Creates a RivetKit instance for Svelte 5 using runes.
 * @param client - The RivetKit client
 * @param opts - Optional configuration
 */
export function createRivetKit<Registry extends AnyActorRegistry>(
  client: Client<Registry>,
  opts: CreateRivetKitOptions<Registry> = {}
) {
  const { getOrCreateActor } = createVanillaRivetKit<
    Registry,
    ExtractActorsFromRegistry<Registry>,
    keyof ExtractActorsFromRegistry<Registry>
  >(client, opts);

  /**
   * Svelte 5 idiomatic hook to connect to an actor and retrieve its state reactively.
   * Returns a $state store for the actor, and a useEvent function for event subscriptions.
   * @param opts - Options for the actor, including its name, key, and parameters.
   */
  function useActor<ActorName extends keyof ExtractActorsFromRegistry<Registry>>(
    opts: ActorOptions<Registry, ActorName>
  ) {
    const { mount, setState, state } = getOrCreateActor<ActorName>(opts);

    // Svelte 5: reactive state from TanStack store
    let actorState = $state<Record<string, any>>({});
    
    // Subscribe to TanStack store changes
    $effect(() => {
      return state.subscribe((newState) => {
        // Replace the entire state object rather than mutating
        actorState = newState || {};
      });
    });

    // Update actor options when props change
    $effect(() => {
      setState((prev) => {
        prev.opts = {
          ...opts,
          enabled: opts.enabled ?? true,
        };
        return prev;
      });
    });

    // Mount the actor and handle cleanup
    $effect(() => {
      return mount();
    });

    /**
     * Svelte 5 idiomatic event subscription for actor events.
     * @param eventName - The event to listen for
     * @param handler - The handler function
     */
    function useEvent(
      eventName: string,
      handler: (...args: any[]) => void
    ) {
      $effect(() => {
        if (!actorState?.connection) return;
        const connection = actorState.connection;
        return connection.on(eventName, handler);
      });
    }

    return {
      ...actorState,
      useEvent,
    };
  }

  return {
    useActor,
  };
}

const { useActor } = createRivetKit(createClient<AnyActorRegistry>("http://localhost:3000"));

const { state, useEvent } = useActor({
  name: "my-actor",
  key: "my-key",
});

$inspect(state);