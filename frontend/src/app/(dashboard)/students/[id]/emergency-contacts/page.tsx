/**
 * Emergency Contacts List Page
 * Displays and manages student emergency contacts
 *
 * @module app/students/[id]/emergency-contacts/page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudent } from '@/lib/actions/students.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  UserPlus,
  Users
} from 'lucide-react';

/**
 * Generate metadata
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    return {
      title: 'Student Not Found | White Cross Healthcare'
    };
  }

  return {
    title: `Emergency Contacts - ${student.firstName} ${student.lastName} | White Cross Healthcare`,
    description: `Manage emergency contacts for ${student.firstName} ${student.lastName}`
  };
}

/**
 * Emergency Contacts List Page
 */
export default async function EmergencyContactsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Emergency Contacts
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {student.firstName} {student.lastName} - Grade {student.grade}
          </p>
        </div>
        <Link href={`/students/${student.id}/emergency-contacts/new`}>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </Link>
      </div>

      {/* Emergency Contacts List */}
      {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {student.emergencyContacts.map((contact) => (
            <Card key={contact.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {contact.firstName} {contact.lastName}
                  </CardTitle>
                  <Badge 
                    variant={contact.priority === 'PRIMARY' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {contact.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contact.relationship}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="break-all">{contact.phoneNumber}</span>
                </div>
                
                {contact.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="break-all">{contact.email}</span>
                  </div>
                )}

                {/* Contact Permissions */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {contact.canPickupStudent && (
                      <Badge variant="outline" className="text-green-600">
                        Can Pick Up
                      </Badge>
                    )}
                    {contact.canAuthorizeEmergencyTreatment && (
                      <Badge variant="outline" className="text-blue-600">
                        Emergency Auth
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Emergency Contacts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm mb-6">
              Add emergency contacts for {student.firstName} to ensure proper communication 
              in case of emergencies or important notifications.
            </p>
            <Link href={`/students/${student.id}/emergency-contacts/new`}>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}