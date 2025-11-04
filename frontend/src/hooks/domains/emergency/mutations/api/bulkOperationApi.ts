// Bulk Operations API
export const bulkOperationApi = {
  bulkUpdateIncidents: async (incidentIds: string[], updates: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  },

  bulkActivateResources: async (resourceIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
};
