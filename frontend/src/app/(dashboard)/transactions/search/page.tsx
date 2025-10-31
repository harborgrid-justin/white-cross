import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  Calendar, 
  CreditCard,
  DollarSign,
  FileText,
  Clock,
  User,
  Hash,
  Eye,
  Download,
  Plus
} from 'lucide-react';

export default function TransactionSearchPage() {
  const recentSearches = [
    'Payment transactions last week',
    'Insurance claims > $500',
    'Pending refunds October',
    'Credit card payments student-123',
    'Disputed transactions 2024',
  ];

  const savedSearches = [
    {
      id: '1',
      name: 'High Value Payments',
      criteria: 'Amount > $1000 AND Type = Payment',
      count: 47,
      lastUsed: '2024-10-31',
    },
    {
      id: '2',
      name: 'Insurance Processing',
      criteria: 'Type = Insurance AND Status = Pending',
      count: 23,
      lastUsed: '2024-10-30',
    },
    {
      id: '3',
      name: 'Monthly Refunds',
      criteria: 'Type = Refund AND Date = Current Month',
      count: 12,
      lastUsed: '2024-10-29',
    },
  ];

  const searchSuggestions = [
    {
      icon: DollarSign,
      title: 'Search by Amount',
      description: 'Find transactions within specific amount ranges',
      examples: ['amount:>500', 'amount:100-1000'],
    },
    {
      icon: Calendar,
      title: 'Search by Date',
      description: 'Filter transactions by date or date range',
      examples: ['date:today', 'date:2024-10-01..2024-10-31'],
    },
    {
      icon: CreditCard,
      title: 'Search by Payment Method',
      description: 'Find transactions by payment type',
      examples: ['method:credit_card', 'method:insurance'],
    },
    {
      icon: User,
      title: 'Search by Student',
      description: 'Find all transactions for a specific student',
      examples: ['student:john-doe', 'student-id:123'],
    },
    {
      icon: Hash,
      title: 'Search by Transaction ID',
      description: 'Find specific transaction by number',
      examples: ['txn:TXN-20241031-A1B2', 'id:abc123'],
    },
    {
      icon: FileText,
      title: 'Search by Status',
      description: 'Filter by transaction status',
      examples: ['status:pending', 'status:completed'],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Transaction Search</h1>
        <p className="text-gray-600">
          Use advanced search operators to find specific financial transactions
        </p>
      </div>

      {/* Advanced Search Form */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Search Transactions</h2>
          </div>

          {/* Main Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search transactions... (e.g., amount:>500 AND type:payment)"
              className="text-lg py-3 pl-4 pr-12"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Advanced Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Transaction Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Select transaction type"
              >
                <option value="">All Types</option>
                <option value="payment">Payment</option>
                <option value="refund">Refund</option>
                <option value="fee">Fee</option>
                <option value="insurance">Insurance</option>
                <option value="copay">Copay</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Select transaction status"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Method</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                aria-label="Select payment method"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2">
                <Input type="date" className="flex-1" aria-label="Start date" />
                <Input type="date" className="flex-1" aria-label="End date" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount Range</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Min ($)" 
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
                <Input 
                  type="number" 
                  placeholder="Max ($)" 
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Student</label>
              <Input 
                type="text" 
                placeholder="Student ID or Name" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search Transactions
            </Button>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Save Search
            </Button>
            
            <Button variant="ghost">
              Clear All
            </Button>
          </div>
        </div>
      </Card>

      {/* Search Suggestions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Tips & Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchSuggestions.map((suggestion, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <suggestion.icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  <div className="space-y-1">
                    {suggestion.examples.map((example, idx) => (
                      <code key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded block">
                        {example}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent & Saved Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
          </div>
          
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="text-sm text-gray-900">{search}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Saved Searches */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Saved Searches</h2>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div key={search.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{search.name}</h3>
                    <p className="text-xs text-gray-600">{search.criteria}</p>
                  </div>
                  <Badge variant="secondary">
                    {search.count}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Last used: {new Date(search.lastUsed).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}