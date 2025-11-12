/**
 * Consent Template Helper
 * Template generation logic for consent forms
 */

export class ConsentTemplateHelper {
  /**
   * Generate HTML template for consent form
   */
  static generateHtmlTemplate(
    formType: string,
    studentName: string,
    schoolName: string,
    date: string,
    studentId: string,
  ): string {
    return `
        <div class="consent-form">
          <h2>${formType} Consent Form</h2>
          <div class="form-header">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>School:</strong> ${schoolName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Student ID:</strong> ${studentId}</p>
          </div>
          <div class="form-content">
            <p>This consent form is generated for ${formType} purposes.</p>
            <p>Please review and sign below to indicate your consent.</p>
          </div>
          <div class="signature-section">
            <p>Signature: ___________________________ Date: ___________</p>
          </div>
        </div>
      `;
  }

  /**
   * Get default template variables
   */
  static getDefaultVariables(
    formType: string,
    studentId: string,
  ): Record<string, string> {
    return {
      studentName: 'Student Name',
      schoolName: 'School Name',
      formType,
      date: new Date().toLocaleDateString(),
      studentId,
    };
  }
}
