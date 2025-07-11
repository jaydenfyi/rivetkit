import { actor } from "@rivetkit/actor";
import { authenticate } from "./my-utils";

// Simple tenant organization actor
const tenant = actor({
  // Example initial state
  state: {
    members: [
      { id: "user-1", name: "Alice", email: "alice@example.com", role: "admin" },
      { id: "user-2", name: "Bob", email: "bob@example.com", role: "member" }
    ],
    invoices: [
      { id: "inv-1", amount: 100, date: Date.now(), paid: true },
      { id: "inv-2", amount: 200, date: Date.now(), paid: false }
    ]
  },

  // Authentication
  createConnState: async (c, { params }) => {
    const token = params.token;
    const userId = await authenticate(token);
    return { userId };
  },

  actions: {
    // Get all members
    getMembers: (c) => {
      return c.state.members;
    },

    // Get all invoices (only admin can access)
    getInvoices: (c) => {
      // Find the user's role by their userId
      const userId = c.conn.userId;
      const user = c.state.members.find(m => m.id === userId);
      
      // Only allow admins to see invoices
      if (!user || user.role !== "admin") {
        throw new UserError("Permission denied: requires admin role");
      }
      
      return c.state.invoices;
    }
  }
});

export default tenant;
