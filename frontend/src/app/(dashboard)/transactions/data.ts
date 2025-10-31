import { z } from 'zod';

// Transaction Types
export type TransactionType = 
  | 'payment' 
  | 'refund' 
  | 'fee' 
  | 'insurance' 
  | 'copay' 
  | 'adjustment' 
  | 'discount' 
  | 'write_off';

export type TransactionStatus = 
  | 'pending' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded' 
  | 'disputed' 
  | 'under_review';

export type PaymentMethod = 
  | 'cash' 
  | 'check' 
  | 'credit_card' 
  | 'debit_card' 
  | 'insurance' 
  | 'bank_transfer' 
  | 'other';

// Core Transaction Interface
export interface Transaction {
  id: string;
  transactionNumber: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: PaymentMethod;
  
  // References
  studentId?: string;
  invoiceId?: string;
  appointmentId?: string;
  
  // Payment Details
  paymentDetails?: PaymentDetails;
  
  // Dates
  transactionDate: Date;
  postedDate?: Date;
  dueDate?: Date;
  
  // Insurance
  insuranceInfo?: InsuranceTransaction;
  
  // Audit
  processedBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Notes
  notes?: string;
  internalNotes?: string;
}

export interface PaymentDetails {
  cardLast4?: string;
  cardType?: string;
  checkNumber?: string;
  referenceNumber?: string;
  authorizationCode?: string;
  processorResponse?: string;
}

export interface InsuranceTransaction {
  insuranceProvider: string;
  policyNumber: string;
  groupNumber?: string;
  claimNumber?: string;
  copayAmount?: number;
  deductibleAmount?: number;
  coveredAmount?: number;
  patientResponsibility?: number;
  preAuthNumber?: string;
}

// Financial Summary Interfaces
export interface FinancialSummary {
  totalRevenue: number;
  pendingTransactions: number;
  completedTransactions: number;
  refundedAmount: number;
  outstandingBalance: number;
  insuranceClaimsCount: number;
  averageTransactionAmount: number;
  monthlyRevenue: MonthlyRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  transactionCount: number;
  averageAmount: number;
}

// Transaction Filtering and Search
export interface TransactionFilters {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  type?: TransactionType[];
  status?: TransactionStatus[];
  paymentMethod?: PaymentMethod[];
  studentId?: string;
  amountRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

export interface TransactionSearchResult {
  transactions: Transaction[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: FinancialSummary;
}

// Validation Schemas
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  transactionNumber: z.string().min(1),
  type: z.enum(['payment', 'refund', 'fee', 'insurance', 'copay', 'adjustment', 'discount', 'write_off']),
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded', 'disputed', 'under_review']),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().min(1),
  paymentMethod: z.enum(['cash', 'check', 'credit_card', 'debit_card', 'insurance', 'bank_transfer', 'other']).optional(),
  studentId: z.string().uuid().optional(),
  invoiceId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional(),
  transactionDate: z.date(),
  postedDate: z.date().optional(),
  dueDate: z.date().optional(),
  processedBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
});

export const TransactionFiltersSchema = z.object({
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }).optional(),
  type: z.array(z.enum(['payment', 'refund', 'fee', 'insurance', 'copay', 'adjustment', 'discount', 'write_off'])).optional(),
  status: z.array(z.enum(['pending', 'completed', 'cancelled', 'refunded', 'disputed', 'under_review'])).optional(),
  paymentMethod: z.array(z.enum(['cash', 'check', 'credit_card', 'debit_card', 'insurance', 'bank_transfer', 'other'])).optional(),
  studentId: z.string().uuid().optional(),
  amountRange: z.object({
    min: z.number().min(0),
    max: z.number().positive(),
  }).optional(),
  searchQuery: z.string().optional(),
});

// Utility Functions
export const transactionUtils = {
  // Status helpers
  isPending: (transaction: Transaction): boolean => 
    transaction.status === 'pending',
  
  isCompleted: (transaction: Transaction): boolean => 
    transaction.status === 'completed',
  
  canBeRefunded: (transaction: Transaction): boolean => 
    transaction.status === 'completed' && transaction.type !== 'refund',
  
  // Amount calculations
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },
  
  calculateTotal: (transactions: Transaction[]): number => 
    transactions.reduce((sum, t) => sum + t.amount, 0),
  
  calculateNetAmount: (transactions: Transaction[]): number => 
    transactions.reduce((sum, t) => {
      const multiplier = t.type === 'refund' || t.type === 'write_off' ? -1 : 1;
      return sum + (t.amount * multiplier);
    }, 0),
  
  // Date helpers
  formatTransactionDate: (date: Date): string => 
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  
  isOverdue: (transaction: Transaction): boolean => {
    if (!transaction.dueDate) return false;
    return new Date() > transaction.dueDate && transaction.status === 'pending';
  },
  
  // Transaction number generation
  generateTransactionNumber: (): string => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  },
  
  // Status styling
  getStatusColor: (status: TransactionStatus): string => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-gray-600 bg-gray-50',
      refunded: 'text-blue-600 bg-blue-50',
      disputed: 'text-red-600 bg-red-50',
      under_review: 'text-purple-600 bg-purple-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  },
  
  getTypeColor: (type: TransactionType): string => {
    const colors = {
      payment: 'text-green-600 bg-green-50',
      refund: 'text-blue-600 bg-blue-50',
      fee: 'text-orange-600 bg-orange-50',
      insurance: 'text-purple-600 bg-purple-50',
      copay: 'text-indigo-600 bg-indigo-50',
      adjustment: 'text-yellow-600 bg-yellow-50',
      discount: 'text-teal-600 bg-teal-50',
      write_off: 'text-red-600 bg-red-50',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  },
  
  // Search and filtering
  matchesSearchQuery: (transaction: Transaction, query: string): boolean => {
    if (!query) return true;
    
    const searchText = query.toLowerCase();
    return (
      transaction.transactionNumber.toLowerCase().includes(searchText) ||
      transaction.description.toLowerCase().includes(searchText) ||
      transaction.type.toLowerCase().includes(searchText) ||
      transaction.status.toLowerCase().includes(searchText) ||
      (transaction.notes?.toLowerCase().includes(searchText) ?? false)
    );
  },
  
  applyFilters: (transactions: Transaction[], filters: TransactionFilters): Transaction[] => {
    return transactions.filter(transaction => {
      // Date range filter
      if (filters.dateRange) {
        const transactionDate = new Date(transaction.transactionDate);
        if (transactionDate < filters.dateRange.startDate || transactionDate > filters.dateRange.endDate) {
          return false;
        }
      }
      
      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(transaction.type)) {
          return false;
        }
      }
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(transaction.status)) {
          return false;
        }
      }
      
      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        if (!transaction.paymentMethod || !filters.paymentMethod.includes(transaction.paymentMethod)) {
          return false;
        }
      }
      
      // Student filter
      if (filters.studentId && transaction.studentId !== filters.studentId) {
        return false;
      }
      
      // Amount range filter
      if (filters.amountRange) {
        if (transaction.amount < filters.amountRange.min || transaction.amount > filters.amountRange.max) {
          return false;
        }
      }
      
      // Search query
      if (filters.searchQuery && !transactionUtils.matchesSearchQuery(transaction, filters.searchQuery)) {
        return false;
      }
      
      return true;
    });
  },
  
  // Summary calculations
  calculateSummary: (transactions: Transaction[]): FinancialSummary => {
    const completed = transactions.filter(t => t.status === 'completed');
    const pending = transactions.filter(t => t.status === 'pending');
    const refunded = transactions.filter(t => t.status === 'refunded');
    const insurance = transactions.filter(t => t.type === 'insurance');
    
    const totalRevenue = transactionUtils.calculateNetAmount(completed);
    const refundedAmount = transactionUtils.calculateTotal(refunded);
    const outstandingBalance = transactionUtils.calculateTotal(pending);
    
    // Calculate monthly revenue
    const monthlyData = new Map<string, { revenue: number; count: number }>();
    completed.forEach(t => {
      const date = new Date(t.transactionDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const existing = monthlyData.get(key) || { revenue: 0, count: 0 };
      monthlyData.set(key, {
        revenue: existing.revenue + t.amount,
        count: existing.count + 1,
      });
    });
    
    const monthlyRevenue = Array.from(monthlyData.entries()).map(([key, data]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: new Date(year, month).toLocaleString('default', { month: 'long' }),
        year,
        revenue: data.revenue,
        transactionCount: data.count,
        averageAmount: data.revenue / data.count,
      };
    });
    
    return {
      totalRevenue,
      pendingTransactions: pending.length,
      completedTransactions: completed.length,
      refundedAmount,
      outstandingBalance,
      insuranceClaimsCount: insurance.length,
      averageTransactionAmount: totalRevenue / completed.length || 0,
      monthlyRevenue,
    };
  },
};

// Mock data for development
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionNumber: 'TXN-20241031-A1B2',
    type: 'payment',
    status: 'completed',
    amount: 150.00,
    currency: 'USD',
    description: 'Annual physical examination',
    paymentMethod: 'credit_card',
    studentId: 'student-1',
    transactionDate: new Date('2024-10-31T10:00:00'),
    postedDate: new Date('2024-10-31T10:05:00'),
    processedBy: 'nurse-1',
    approvedBy: 'admin-1',
    createdAt: new Date('2024-10-31T10:00:00'),
    updatedAt: new Date('2024-10-31T10:05:00'),
    paymentDetails: {
      cardLast4: '1234',
      cardType: 'Visa',
      authorizationCode: 'AUTH123456',
    },
  },
  {
    id: '2',
    transactionNumber: 'TXN-20241030-C3D4',
    type: 'insurance',
    status: 'pending',
    amount: 200.00,
    currency: 'USD',
    description: 'Emergency care visit',
    paymentMethod: 'insurance',
    studentId: 'student-2',
    transactionDate: new Date('2024-10-30T14:30:00'),
    dueDate: new Date('2024-11-15T23:59:59'),
    processedBy: 'nurse-2',
    createdAt: new Date('2024-10-30T14:30:00'),
    updatedAt: new Date('2024-10-30T14:30:00'),
    insuranceInfo: {
      insuranceProvider: 'Blue Cross Blue Shield',
      policyNumber: 'POL123456789',
      claimNumber: 'CLM987654321',
      copayAmount: 25.00,
      patientResponsibility: 50.00,
      coveredAmount: 150.00,
    },
  },
];