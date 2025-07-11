import { join } from "node:path";
import { createTestRuntime, runDriverTests } from "@/driver-test-suite/mod";
import { createMemoryDriver } from "@/drivers/memory/mod";

runDriverTests({
	async start(projectPath: string) {
		return await createTestRuntime(
			join(projectPath, "registry.ts"),
			async () => {
				return {
					driver: createMemoryDriver(),
				};
			},
		);
	},
});
