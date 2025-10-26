import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Policy Acknowledgments | Compliance | White Cross',
};

const mockAcknowledgments = [
  { id: '1', userName: 'Sarah Johnson', userRole: 'School Nurse', status: 'acknowledged', date: '2024-01-15', signature: true },
  { id: '2', userName: 'Michael Chen', userRole: 'Administrator', status: 'acknowledged', date: '2024-01-14', signature: true },
  { id: '3', userName: 'Emily Davis', userRole: 'Health Assistant', status: 'pending', date: null, signature: false },
  { id: '4', userName: 'John Smith', userRole: 'School Nurse', status: 'overdue', date: null, signature: false },
];

export default function PolicyAcknowledgmentsPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Policy Acknowledgments</h1>
        <p className="text-gray-600 mt-2">HIPAA Privacy Policy v2.1.0</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">100</div><div className="text-sm text-gray-600">Total</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">95</div><div className="text-sm text-gray-600">Acknowledged</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-yellow-600">3</div><div className="text-sm text-gray-600">Pending</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">2</div><div className="text-sm text-gray-600">Overdue</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Acknowledgment List</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAcknowledgments.map((ack) => (
              <div key={ack.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {ack.status === 'acknowledged' ? <CheckCircle className="h-5 w-5 text-green-500" /> :
                   ack.status === 'pending' ? <Clock className="h-5 w-5 text-yellow-500" /> :
                   <XCircle className="h-5 w-5 text-red-500" />}
                  <div>
                    <div className="font-medium">{ack.userName}</div>
                    <div className="text-sm text-gray-600">{ack.userRole}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={ack.status === 'acknowledged' ? 'bg-green-100 text-green-800' : ack.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {ack.status}
                  </Badge>
                  {ack.date && <div className="text-sm text-gray-600 mt-1">{ack.date}</div>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
